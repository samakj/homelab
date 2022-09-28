from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestForwardingClient,
    AsyncRequestClient,
)
from shared.python.models.session import Session


class SessionsClient:
    client: AsyncInternalClient
    base_url: str

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "SessionsClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return SessionsClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

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
            json={
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
            json=dict(session),
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
