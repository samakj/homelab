from typing import Optional, Union
from fastapi import Depends, Request

from shared.python.config.auth import AUTH_NAME
from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.user import UserNoPassword


class UsersClient:
    client: AsyncInternalClient
    token: Optional[str]
    base_url: str

    def __init__(
        self,
        request: Request,
        client: AsyncInternalRequestClient = Depends(AsyncInternalRequestClient()),
    ) -> None:
        self.client = client

        self.token = request.cookies.get(AUTH_NAME)
        if self.token is None:
            self.token = request.headers.get(AUTH_NAME)
        if self.token is None:
            self.token = request.query_params.get(AUTH_NAME)
        self.base_url = request.app.config.get("urls", {}).get("authorisation_api")
        if self.base_url is None:
            raise ValueError("config.urls.auhorisation_api not set.")

    async def get_user(self, id: int) -> UserNoPassword:
        response = await self.client.get(f"{self.base_url}/v0/users/{id}")
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def get_user_by_username(self, username: str) -> UserNoPassword:
        response = await self.client.get(f"{self.base_url}/v0/users/{username}")
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def get_self(self) -> UserNoPassword:
        response = await self.client.get(
            f"{self.base_url}/v0/users/self",
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def get_users(
        self,
        id: Optional[Union[int, list[int]]] = None,
        username: Optional[Union[str, list[str]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        scopes: Optional[Union[str, list[str]]] = None,
    ) -> list[UserNoPassword]:
        response = await self.client.get(
            f"{self.base_url}/v0/users/{id}",
            params={"id": id, "username": username, "name": name, "scopes": scopes},
        )
        data = response.json()
        return [UserNoPassword.parse_obj(user) for user in data]

    async def create_user(
        self,
        username: str,
        password: str,
        name: str,
        scopes: list[str],
    ) -> UserNoPassword:
        response = await self.client.post(
            f"{self.base_url}/v0/users/{id}",
            data={
                "username": username,
                "password": password,
                "name": name,
                "scopes": scopes,
            },
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def update_user(
        self,
        user: UserNoPassword,
    ) -> UserNoPassword:
        response = await self.client.patch(
            f"{self.base_url}/v0/users/{user.id}",
            data=dict(user),
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> UserNoPassword:
        await self.client.delete(f"{self.base_url}/v0/users/{id}")
        return None
