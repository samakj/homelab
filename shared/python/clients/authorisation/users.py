from typing import Optional, Union
from fastapi import Depends, Request, WebSocket

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncInternalRequestClient,
)
from shared.python.models.user import UserNoPassword


class UsersClient:
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
