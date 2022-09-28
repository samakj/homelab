from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncInternalClient,
    AsyncRequestForwardingClient,
    AsyncRequestClient,
)
from shared.python.models.user import UserNoPassword


class UsersClient:
    client: AsyncInternalClient
    base_url: str

    @staticmethod
    def depencency(
        connection: HTTPConnection,
        client: AsyncInternalClient = Depends(AsyncRequestForwardingClient()),
    ) -> "UsersClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return UsersClient(base_url=base_url, client=client)

    def __init__(
        self,
        base_url: str,
        access_token: str = "",
        client: Optional[AsyncInternalClient] = None,
    ) -> None:
        self.client = client or AsyncRequestClient(access_token=access_token)
        self.base_url = base_url

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
            json={
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
            json=dict(user),
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> UserNoPassword:
        await self.client.delete(f"{self.base_url}/v0/users/{id}")
        return None
