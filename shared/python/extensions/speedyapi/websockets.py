from datetime import datetime
import json
from typing import Any, Callable, Coroutine, Dict, Iterator, Optional
from uuid import uuid4
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.requests import HTTPConnection

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

    def __init__(
        self,
        websocket: WebSocket,
        scope: str,
        session: Session,
        logger: Optional[Logger] = None,
    ) -> None:
        self.id = uuid4().hex
        self.created = datetime.utcnow()
        self.websocket = websocket
        self.scope = scope
        self.session = session
        self.closed = False
        self.close_reason = ""
        self.logger = logger

    async def initialise(self) -> None:
        await self.websocket.accept()

    def is_in_scope(self, scope: str) -> bool:
        return scope.startswith(self.scope)

    async def send(self, message: str) -> None:
        await self.websocket.send_text(data=message)

    async def close(self, reason: str) -> None:
        await self.websocket.send_text(
            json.dumps({"action": "CLOSE", "reason": reason})
        )
        self.closed = True
        self.close_reason = reason

    async def listen(
        self, on_message: Optional[Callable[[str], Coroutine[Any, Any, None]]] = None
    ) -> None:
        try:
            while True:
                if self.session.expires < datetime.utcnow():
                    await self.close("Session has expired.")
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


class WebsocketsStore:
    connections: Dict[str, WebsocketConnection]

    def __init__(self) -> None:
        self.connections = {}

    async def add_websocket(
        self, websocket: WebSocket, scope: str, session: Session
    ) -> WebsocketConnection:
        connection = WebsocketConnection(
            websocket=websocket, scope=scope, session=session
        )
        self.connections[connection.id] = connection
        await connection.initialise()
        return connection

    async def remove_connection(
        self, websocket_connection: WebsocketConnection, reason: str
    ) -> None:
        await self.connections[websocket_connection.id].close(reason=reason)
        del self.connections[websocket_connection.id]

    def get_connections(
        self,
    ) -> Iterator[WebsocketConnection]:
        for connection in self.connections.values():
            yield connection

    def get_scope(
        self,
        scope: str,
    ) -> Iterator[WebsocketConnection]:
        for connection in self.get_connections():
            if connection.is_in_scope(scope):
                yield connection

    async def broadcast(
        self,
        message: str,
    ) -> None:
        for connection in self.get_connections():
            await connection.send(message)

    async def broadcast_to_scope(
        self,
        scope: str,
        message: str,
    ) -> None:
        for connection in self.get_scope(scope):
            await connection.send(message)


class Websockets:
    http_connection: HTTPConnection
    websockets_store: WebsocketsStore

    def __init__(self, http_connection: HTTPConnection) -> None:
        self.http_connection = http_connection
        self.websockets_store = http_connection.app.websockets

    async def add_websocket(self, scope: str, session: Session) -> WebsocketConnection:
        if not isinstance(self.http_connection, WebSocket):
            raise TypeError("Cannot create websocket with plain http request.")

        return await self.websockets_store.add_websocket(
            websocket=self.http_connection, scope=scope, session=session
        )

    async def remove_connection(
        self, websocket_connection: WebsocketConnection, reason: str
    ) -> None:
        await self.websockets_store.remove_connection(
            websocket_connection=websocket_connection, reason=reason
        )

    def get_connections(
        self,
    ) -> Iterator[WebsocketConnection]:
        for connection in self.websockets_store.get_connections():
            yield connection

    def get_scope(
        self,
        scope: str,
    ) -> Iterator[WebsocketConnection]:
        for connection in self.get_connections():
            if connection.is_in_scope(scope):
                yield connection

    async def broadcast(
        self,
        message: str,
    ) -> None:
        for connection in self.get_connections():
            await connection.send(message)

    async def broadcast_to_scope(
        self,
        scope: str,
        message: str,
    ) -> None:
        for connection in self.get_scope(scope):
            await connection.send(message)
