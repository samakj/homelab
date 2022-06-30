from typing import Optional
from fastapi import Depends, Request

from shared.python.config.auth import AUTH_NAME, AUTH_SCHEME
from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.authorisation import UserCredentials, LoginResponse
from shared.python.models.user import UserNoPassword
from shared.python.clients.authorisation.users import UsersClient
from shared.python.clients.authorisation.sessions import SessionsClient


class AuthorisationClient:
    client: AsyncInternalClient
    base_url: str
    users: UsersClient
    sessions: SessionsClient

    def __init__(
        self,
        request: Request,
        client: AsyncInternalRequestClient = Depends(AsyncInternalRequestClient()),
    ) -> None:
        self.client = client

        self.base_url = request.app.config.get("urls", {}).get("authorisation_api")
        if self.base_url is None:
            raise ValueError("config.urls.auhorisation_api not set.")

        self.users = UsersClient(request=request, client=client)
        self.sessions = SessionsClient(request=request, client=client)

    async def login(self, username: str, password: str) -> LoginResponse:
        response = await self.client.post(
            f"{self.base_url}/v0/login",
            data={"username": username, "password": password},
        )
        data = response.json()
        return LoginResponse.parse_obj(data)

    async def check_token(self) -> UserCredentials:
        response = await self.client.get(f"{self.base_url}/v0/token")
        data = response.json()
        return UserCredentials.parse_obj(data)
