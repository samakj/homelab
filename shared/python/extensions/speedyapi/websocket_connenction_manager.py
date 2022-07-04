from datetime import datetime
import json
from typing import Any, Coroutine, Dict, Iterator, Optional
from uuid import uuid4
from fastapi import Request, WebSocket, WebSocketDisconnect

from shared.python.models.session import Session
from shared.python.extensions.speedyapi.logger import Logger


class WebsocketConnection:
    id: str
    created: datetime
    websocket: WebSocket
    scope: str
    session: Session
    closed: bool
    close_reason: str
    logger: Optional[Logger] = None

    def __init__(self, websocket: WebSocket, scope: str, session: Session) -> None:
        self.id = uuid4().hex
        self.created = datetime.utcnow()
        self.websocket = websocket
        self.scope = scope
        self.session = session
        self.closed = False
        self.close_reason = ""

    async def initialise(self) -> None:
        await self.websocket.accept()

    def is_in_scope(self, scope: str) -> bool:
        return scope.startswith(self.scope)

    async def send(self, message: str) -> None:
        await self.websocket.send_text(data=message)

    async def close(self, reason: str) -> None:
        self.websocket.send_text(json.dumps({"action": "CLOSE", "reason": reason}))
        self.closed = True
        self.close_reason = reason

    async def listen(
        self, on_message: Optional[Coroutine[str, Any, None]] = None
    ) -> None:
        try:
            while True:
                if self.session.expires < datetime.utcnow():
                    self.close("Session has expired.")
                if self.closed:
                    await self.websocket.close(reason=self.close_reason)
                    break

                message = await self.websocket.receive_text()
                if on_message is not None:
                    await on_message(message)
        except WebSocketDisconnect:
            log = self.logger.warning if self.logger is not None else print
            log("Websocket unexpectedly closed:")
            log(
                f"    client={self.websocket.client.host if self.websocket.client else 'unknown'}"
                + f"    path={self.websocket.url.path}"
            )


class WebsocketConnectionManager:
    connections: Dict[str, WebsocketConnection]
    logger: Optional[Logger] = None

    def __init__(self) -> None:
        self.connections = {}

    def __call__(
        self,
        request: Request = None,  # type: ignore
        websocket: WebSocket = None,  # type: ignore
    ) -> "WebsocketConnectionManager":
        self.set_logger((request if request is not None else websocket).app.logger)
        return self

    def set_logger(self, logger: Optional[Logger] = None) -> None:
        self.logger = logger
        for connection in self.connections.values():
            connection.logger = logger

    async def add_websocket(
        self, websocket: WebSocket, scope: str, session: Session
    ) -> WebsocketConnection:
        connection = WebsocketConnection(
            websocket=websocket, scope=scope, session=session
        )
        self.connections[connection.id] = connection
        await connection.initialise()
        return connection

    async def remove_connection(self, connection: WebsocketConnection) -> None:
        await self.connections[connection.id].close()
        del self.connections[connection.id]

    def get_scope(self, scope: str) -> Iterator[WebsocketConnection]:
        for connection in self.connections.values():
            if connection.is_in_scope(scope):
                yield connection

    async def send_to_scope(self, scope: str, message: str) -> None:
        for connection in self.get_scope(scope):
            await connection.send(message)
