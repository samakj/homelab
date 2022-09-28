from typing import Optional
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.authorisation import UserCredentials, LoginResponse
from shared.python.clients.authorisation.users import UsersClient
from shared.python.clients.authorisation.sessions import SessionsClient


class AuthorisationClient:
    client: AsyncInternalClient
    base_url: str
    users: UsersClient
    sessions: SessionsClient

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "AuthorisationClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return AuthorisationClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

        self.users = UsersClient(base_url=base_url, client=client)
        self.sessions = SessionsClient(base_url=base_url, client=client)

    async def login(self, username: str, password: str) -> LoginResponse:
        response = await self.client.post(
            f"{self.base_url}/v0/login",
            json={"username": username, "password": password},
        )
        data = response.json()
        return LoginResponse.parse_obj(data)

    async def check_token(self) -> UserCredentials:
        response = await self.client.get(
            f"{self.base_url}/v0/token", params={"access_token": self.client.token}
        )
        data = response.json()
        return UserCredentials.parse_obj(data)
