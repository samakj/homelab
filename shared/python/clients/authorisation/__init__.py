from typing import Optional
from fastapi import Depends, Request
from httpx import AsyncClient

from shared.python.config.auth import AUTH_COOKIE_NAME, AUTH_SCHEME
from shared.python.extensions.httpy import AsyncRequestClient
from shared.python.models.authorisation import UserCredentials
from shared.python.models.user import UserNoPassword
from shared.python.clients.authorisation.users import UsersClient
from shared.python.clients.authorisation.sessions import SessionsClient


class AuthorisationClient:
    client: AsyncClient
    token: Optional[str]
    users: UsersClient
    sessions: SessionsClient

    def __init__(
        self,
        request: Request,
        client: AsyncRequestClient = Depends(AsyncRequestClient()),
    ) -> None:
        self.client = client
        self.token = request.cookies.get(AUTH_COOKIE_NAME)
        self.users = UsersClient(request=request, client=client)
        self.sessions = SessionsClient(request=request, client=client)

    async def login(self, username: str, password: str) -> UserNoPassword:
        response = await self.client.post(
            "/v0/login", data={"username": username, "password": password}
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def check_token(self) -> UserCredentials:
        response = await self.client.get(
            "/v0/token", cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"}
        )
        data = response.json()
        return UserCredentials.parse_obj(data)
