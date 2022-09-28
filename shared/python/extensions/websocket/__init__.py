import asyncio
from typing import Optional, Union
import websockets
from pydantic import BaseModel
from datetime import datetime


class WebsocketMessageHandler:
    def __init__(self) -> None:
        pass

    def __call__(self, message: str) -> None:
        print(message)


class WebsocketMeta(BaseModel):
    url: str
    opened: Optional[datetime] = None
    closed: Optional[datetime] = None
    last_message: Optional[datetime] = None
    message_count: int = 0
    reconnect_count: int = -1
    auto_reconnect: bool = True
    reconnect_delay: int = 5
    connection_error: Optional[
        Union[
            websockets.InvalidURI,
            websockets.InvalidHandshake,
            asyncio.TimeoutError,
        ]
    ] = None
    listen_error: Optional[
        Union[websockets.ConnectionClosedError, asyncio.CancelledError]
    ] = None


class Websocket:
    handler: WebsocketMessageHandler
    socket: Optional[websockets.ClientConnection]
    task: Optional[asyncio.Task]
    meta: WebsocketMeta
    disconnecting: bool

    def __init__(
        self, url: str, handler: WebsocketMessageHandler, auto_reconnect: bool = True
    ) -> None:
        super().__init__()
        self.handler = handler
        self.socket = None
        self.meta = WebsocketMeta(url=url, auto_reconnect=auto_reconnect)
        self.disconnecting = False
        self.task = None

    def is_connected(self) -> bool:
        return self.socket is not None and self.socket.open

    async def connect(self) -> websockets.ClientConnection:
        if not self.is_connected:
            try:
                self.socket = await websockets.client.connect(uri=self.meta.url)
                self.meta.opened = datetime.utcnow()
                self.meta.closed = None
                self.meta.last_message = None
                self.meta.message_count = 0
                self.meta.reconnect_count += 1
                self.meta.connection_error = None
                self.meta.listen_error = None
            except websockets.InvalidURI as error:
                self.meta.connection_error = error
            except websockets.InvalidHandshake as error:
                self.meta.connection_error = error
            except asyncio.TimeoutError as error:
                self.meta.connection_error = error

        return self.socket

    async def disconnect(self) -> None:
        self.disconnecting = True

        if self.task is not None:
            self.task.cancel()
            self.task = None

        self.disconnecting = False

    async def listen(self) -> asyncio.Task:
        if self.task is None:
            self.task = asyncio.create_task(self._reconnector())

        return self.task

    async def _reconnector(self) -> None:
        reconnect = True
        while reconnect:
            try:
                await self._listen()
            except websockets.ConnectionClosedError as error:
                self.meta.listen_error = error
            except asyncio.CancelledError as error:
                self.meta.listen_error = error

            if self.socket is not None:
                if self.socket.open:
                    await self.socket.close()
                self.socket = None

            self.meta.closed = datetime.utcnow()

            if not self.meta.auto_reconnect or self.disconnecting:
                reconnect = False

    async def _listen(self) -> None:
        websocket = self.connect()

        if websocket is not None:
            async for raw_message in websocket:
                self.meta.message_count += 1
                self.meta.last_message = datetime.utcnow()
                self.handler(raw_message)
