import asyncio
from shared.python.extensions.speedyapi.logger import Logger
from typing import Optional
import websockets
from pydantic import BaseModel
from datetime import datetime


class WebsocketMessageHandler:
    logger: Logger

    def __init__(self, logger: Logger) -> None:
        self.logger = logger

    async def __call__(self, message: str) -> None:
        print(message)


class WebsocketMeta(BaseModel):
    url: str
    opened: Optional[datetime] = None
    closed: Optional[datetime] = None
    last_message: Optional[datetime] = None
    message_count: int = 0
    first_connect: Optional[datetime] = None
    reconnect_count: int = -1
    auto_reconnect: bool = True
    reconnect_delay: int = 5
    connection_error: Optional[str] = None
    listen_error: Optional[str] = None


class Websocket:
    logger: Logger
    handler: WebsocketMessageHandler
    socket: Optional[websockets.ClientConnection]
    task: Optional[asyncio.Task]
    meta: WebsocketMeta
    disconnecting: bool

    def __init__(
        self,
        url: str,
        handler: WebsocketMessageHandler,
        logger: Logger,
        auto_reconnect: bool = True,
    ) -> None:
        super().__init__()
        self.logger = logger
        self.handler = handler
        self.socket = None
        self.meta = WebsocketMeta(url=url, auto_reconnect=auto_reconnect)
        self.disconnecting = False
        self.task = None

    def is_connected(self) -> bool:
        return self.socket is not None and self.socket.open

    async def connect(self) -> Optional[websockets.ClientConnection]:
        if not self.is_connected():
            self.logger.info(f"Connecting to websocket at {self.meta.url}")
            self.meta.reconnect_count += 1
            try:
                self.socket = await websockets.client.connect(uri=self.meta.url)
                now = datetime.utcnow()
                self.meta.opened = now
                self.meta.closed = None
                self.meta.last_message = None
                self.meta.message_count = 0
                self.meta.connection_error = None
                self.meta.listen_error = None
                if self.meta.first_connect is None:
                    self.meta.first_connect = now
                self.logger.info(f"Connected to websocket at {self.meta.url}")
            except websockets.InvalidURI as error:
                self.logger.error(
                    f"Failed to connect to websocket at '{self.meta.url}': {error}"
                )
                self.meta.connection_error = str(error)
            except websockets.InvalidHandshake as error:
                self.logger.error(
                    f"Failed to connect to websocket at '{self.meta.url}': {error}"
                )
                self.meta.connection_error = str(error)
            except asyncio.TimeoutError as error:
                self.logger.error(
                    f"Failed to connect to websocket at '{self.meta.url}': {error}"
                )
                self.meta.connection_error = str(error)

        return self.socket

    async def disconnect(self) -> None:
        self.disconnecting = True

        if self.task is not None:
            self.task.cancel()
            self.task = None

        self.meta.first_connect = None
        self.disconnecting = False

    async def listen(self) -> asyncio.Task:
        if self.task is None:
            self.task = asyncio.create_task(self._reconnector())

        return self.task

    async def _reconnector(self) -> None:
        try:
            disconnect = False
            reconnect = True
            while reconnect:
                try:
                    await self._listen()
                except websockets.ConnectionClosedError as error:
                    self.logger.error(f"Websocket at '{self.meta.url}' closed: {error}")
                    self.meta.listen_error = str(error)
                except asyncio.CancelledError as error:
                    self.logger.error(
                        f"Websocket at '{self.meta.url}' task cancelled: {error}"
                    )
                    self.meta.listen_error = str(error)
                    disconnect = True

                if self.socket is not None:
                    if self.socket.open:
                        await self.socket.close()
                    self.socket = None

                self.meta.closed = datetime.utcnow()

                if (not self.meta.auto_reconnect) or disconnect:
                    self.logger.info(
                        f"Will not reconnect to '{self.meta.url}': "
                        + f"auto_reconnect={self.meta.auto_reconnect} "
                        + f"disconnect={disconnect}"
                    )
                    reconnect = False
                else:
                    self.logger.info(
                        f"Will reconnect to '{self.meta.url}' in {self.meta.reconnect_delay}s, "
                        + f"{self.meta.reconnect_count} reconnects since {self.meta.first_connect}:"
                        + f" auto_reconnect={self.meta.auto_reconnect} "
                        + f"disconnect={disconnect}"
                    )
                    await asyncio.sleep(self.meta.reconnect_delay)
        except Exception as error:
            self.logger.exception(error)

    async def _listen(self) -> None:
        websocket = await self.connect()

        if websocket is not None:
            self.logger.info(f"Listening to websocket at {self.meta.url}")
            async for raw_message in websocket:
                self.meta.message_count += 1
                self.meta.last_message = datetime.utcnow()
                await self.handler(raw_message)
        else:
            self.logger.info(f"Failed to get socket to listen to for {self.meta.url}")
