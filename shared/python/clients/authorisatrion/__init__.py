from typing import Optional
from fastapi import Depends
from httpx import AsyncClient

from shared.python.config.auth import AUTH_COOKIE_NAME, AUTH_SCHEME
from shared.python.extensions.httpy import AsyncRequestClient
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
        token: Optional[str] = None,
        client: AsyncRequestClient = Depends(AsyncRequestClient()),
    ) -> None:
        self.client = client
        self.token = token
        self.users = UsersClient(token=token, client=client)
        self.sessions = SessionsClient(token=token, client=client)

    async def login(self, username: str, password: str) -> UserNoPassword:
        response = await self.client.post(
            "/v0/login", data={"username": username, "password": password}
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def check_token(self) -> UserNoPassword:
        response = await self.client.get(
            "/v0/token", cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"}
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)
