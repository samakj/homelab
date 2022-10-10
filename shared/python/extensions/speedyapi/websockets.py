from asyncio import CancelledError
from datetime import datetime
import json
from typing import Any, Callable, Coroutine, Dict, Iterator, Optional
from uuid import uuid4
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState
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
    logger: Logger

    def __init__(
        self,
        websocket: WebSocket,
        scope: str,
        session: Session,
        logger: Logger,
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
        try:
            if self.websocket.client_state != WebSocketState.DISCONNECTED:
                await self.websocket.send_text(data=message)
            else:
                await self.close("Failed to send")
        except Exception:  # as error:
            # self.logger.exception(error)
            await self.close("Failed to send")

    async def close(self, reason: Optional[str] = None) -> None:
        if self.websocket.client_state != WebSocketState.DISCONNECTED and reason:
            await self.websocket.send_text(
                json.dumps({"action": "CLOSE", "reason": reason})
            )
            await self.websocket.close(reason=reason)
        self.closed = True
        self.close_reason = reason

    async def listen(
        self, on_message: Optional[Callable[[str], Coroutine[Any, Any, None]]] = None
    ) -> None:
        try:
            while True:
                if self.session.expires < datetime.utcnow():
                    await self.close("Session has expired.")
                message = await self.websocket.receive_text()
                if on_message is not None:
                    await on_message(message)
        except CancelledError:
            self.logger.warning("Websocket unexpectedly cancelled:")
            self.logger.warning(
                f"    client={self.websocket.client.host if self.websocket.client else 'unknown'}"
                + f"    path={self.websocket.url.path}"
            )
            await self.close(reason="Server cancel")
        except WebSocketDisconnect:
            if not self.closed:
                self.logger.warning("Websocket unexpectedly disconnected:")
                self.logger.warning(
                    f"    client={self.websocket.client.host if self.websocket.client else 'unknown'}"
                    + f"    path={self.websocket.url.path}"
                )
                await self.close(reason="Server disconnect")


class WebsocketsStore:
    connections: Dict[str, WebsocketConnection]

    def __init__(self) -> None:
        self.connections = {}

    async def add_websocket(
        self, websocket: WebSocket, scope: str, session: Session
    ) -> WebsocketConnection:
        connection = WebsocketConnection(
            websocket=websocket,
            scope=scope,
            session=session,
            logger=websocket.app.logger,
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
        to_delete: list[str] = []
        for connection in self.connections.values():
            # For when socket closes without using store remove function
            if connection.closed:
                to_delete.append(connection.id)
                continue

            yield connection
        for id in to_delete:
            del self.connections[connection.id]

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
