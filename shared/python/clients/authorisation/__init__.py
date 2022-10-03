from typing import Optional
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncRequestClient,
    AsyncRequestForwardingClient,
)
from shared.python.models.authorisation import UserCredentials, LoginResponse
from shared.python.clients.authorisation.users import UsersClient
from shared.python.clients.authorisation.sessions import SessionsClient


class AuthorisationClient:
    base_url: str
    http_client: AsyncRequestClient
    users: UsersClient
    sessions: SessionsClient

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "AuthorisationClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return AuthorisationClient(base_url=base_url, http_client=client)

    def __init__(
        self,
        base_url: str,
        http_client: Optional[AsyncRequestClient] = None,
        access_token: Optional[str] = None,
    ) -> None:
        self.http_client = http_client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

        self.users = UsersClient(base_url=base_url, http_client=http_client)
        self.sessions = SessionsClient(base_url=base_url, http_client=http_client)

    def set_access_token(self, access_token: Optional[str] = None) -> None:
        self.http_client.set_access_token(access_token=access_token)
        self.users.set_access_token(access_token=access_token)
        self.sessions.set_access_token(access_token=access_token)

    async def login(self, username: str, password: str) -> LoginResponse:
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/login",
                json={"username": username, "password": password},
            )
            data = response.json()
            return LoginResponse.parse_obj(data)

    async def check_token(self) -> UserCredentials:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/token")
            data = response.json()
            return UserCredentials.parse_obj(data)
