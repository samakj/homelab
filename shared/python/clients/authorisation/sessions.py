from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncRequestForwardingClient,
    AsyncRequestClient,
)
from shared.python.models.session import Session
from shared.python.json import to_json_serialisable


class SessionsClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "SessionsClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return SessionsClient(base_url=base_url, http_client=client)

    def __init__(
        self,
        base_url: str,
        http_client: Optional[AsyncRequestClient] = None,
        access_token: Optional[str] = None,
    ) -> None:
        self.http_client = http_client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

    def set_access_token(self, access_token: Optional[str] = None) -> None:
        self.http_client.set_access_token(access_token=access_token)

    async def get_session(self, id: int) -> Session:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/sessions/{id}")
            data = response.json()
            return Session.parse_obj(data)

    async def get_sessions(
        self,
        id: Optional[Union[int, list[int]]] = None,
        user_id: Optional[Union[int, list[int]]] = None,
        ip: Optional[Union[str, list[str]]] = None,
    ) -> list[Session]:
        params = {}

        if id is not None:
            params["id"] = id
        if user_id is not None:
            params["user_id"] = user_id
        if ip is not None:
            params["ip"] = ip

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/sessions/{id}", params=params
            )
            data = response.json()
            return [Session.parse_obj(session) for session in data]

    async def create_session(
        self,
        user_id: int,
        ip: str,
    ) -> Session:
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/sessions/{id}",
                json=to_json_serialisable(
                    {
                        "user_id": user_id,
                        "ip": ip,
                    }
                ),
            )
            data = response.json()
            return Session.parse_obj(data)

    async def update_session(
        self,
        session: Session,
    ) -> Session:
        async with self.http_client() as http:
            response = await http.patch(
                f"{self.base_url}/v0/sessions/{session.id}",
                data=session.json(encoder=to_json_serialisable),
            )
            data = response.json()
            return Session.parse_obj(data)

    async def delete_session(
        self,
        id: int,
    ) -> None:
        async with self.http_client() as http:
            await http.delete(
                f"{self.base_url}/v0/sessions/{id}",
            )
            return None
