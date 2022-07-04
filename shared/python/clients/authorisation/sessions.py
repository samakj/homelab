from typing import Optional, Union
from fastapi import Depends, Request, WebSocket

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.session import Session


class SessionsClient:
    client: AsyncInternalClient
    base_url: str

    def __init__(
        self,
        request: Request = None,  # type: ignore
        websocket: WebSocket = None,  # type: ignore
        client: AsyncInternalRequestClient = Depends(AsyncInternalRequestClient()),
    ) -> None:
        connection = request if request is not None else websocket
        self.client = client

        self.base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if self.base_url is None:
            raise ValueError("config.urls.auhorisation_api not set.")

    async def get_session(self, id: int) -> Session:
        response = await self.client.get(f"{self.base_url}/v0/sessions/{id}")
        data = response.json()
        return Session.parse_obj(data)

    async def get_sessions(
        self,
        id: Optional[Union[int, list[int]]] = None,
        user_id: Optional[Union[int, list[int]]] = None,
        ip: Optional[Union[str, list[str]]] = None,
    ) -> list[Session]:
        response = await self.client.get(
            f"{self.base_url}/v0/sessions/{id}",
            params={"id": id, "user_id": user_id, "ip": ip},
        )
        data = response.json()
        return [Session.parse_obj(user) for user in data]

    async def create_session(
        self,
        user_id: int,
        ip: str,
    ) -> Session:
        response = await self.client.post(
            f"{self.base_url}/v0/sessions/{id}",
            data={
                "user_id": user_id,
                "ip": ip,
            },
        )
        data = response.json()
        return Session.parse_obj(data)

    async def update_user(
        self,
        session: Session,
    ) -> Session:
        response = await self.client.patch(
            f"{self.base_url}/v0/sessions/{session.id}",
            data=dict(session),
        )
        data = response.json()
        return Session.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> None:
        await self.client.delete(
            f"{self.base_url}/v0/sessions/{id}",
        )
        return None
