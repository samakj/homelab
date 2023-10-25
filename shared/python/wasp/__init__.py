from typing import Optional
from fastapi import WebSocket
from pydantic import BaseModel
from datetime import datetime

from connection import WaspConnection
from message import (
    WaspRequest,
    WaspResponse,
    WaspRequestMethod,
    WaspResponseMeta,
    WaspResponseStatus,
)

DEFAULT_BROADCAST_STATUS = WaspResponseStatus(ok=True, code=200)


# An implementation of a websocket protocol that also handles http like requests for CRUD actions.
class Wasp:
    next_connection_id: int
    connections: dict[int, WaspConnection]

    def __init__(self) -> None:
        self.next_connection_id = 1
        self.connections = {}

    def __call__(self) -> "Wasp":
        return self

    async def register(self, websocket: WebSocket) -> WaspConnection:
        # Get connection id and increment next_connection_id
        id = self.next_connection_id
        self.next_connection_id += 1

        # Create and return connection
        self.connections[id] = WaspConnection(
            websocket=websocket, id=id, on_message=self.handle_message
        )
        return self.connections[id]

    async def broadcast(
        self,
        uri: str,
        data: list[BaseModel],
        method: WaspRequestMethod = WaspRequestMethod.GET,
        status: WaspResponseStatus = DEFAULT_BROADCAST_STATUS,
        meta: Optional[WaspResponseMeta] = None,
    ) -> None:
        response = WaspResponse(
            request=WaspRequest(id="", uri=uri, method=method),
            data=data,
            status=status,
            meta=meta
            if meta is not None
            else WaspResponseMeta(start=datetime.utcnow(), end=datetime.utcnow(), duration=0),
        )
        for connection in self.connections.values():
            await connection.queue_response_if_listening(response=response)

    async def handle_message(self, connection: WaspConnection, request: WaspRequest) -> None:
        pass
