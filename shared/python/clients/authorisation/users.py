from typing import Optional, Union
from fastapi import Depends
from fastapi.requests import HTTPConnection

from shared.python.extensions.httpy import (
    AsyncRequestForwardingClient,
    AsyncRequestClient,
)
from shared.python.models.user import UserNoPassword
from shared.python.json import to_json_serialisable


class UsersClient:
    http_client: AsyncRequestClient
    base_url: str

    @staticmethod
    def dependency(
        connection: HTTPConnection,
        client: AsyncRequestClient = Depends(AsyncRequestForwardingClient),
    ) -> "UsersClient":
        base_url = connection.app.config.get("urls", {}).get("authorisation_api")
        if base_url is None:
            raise ValueError("config.urls.authorisation_api not set.")

        return UsersClient(base_url=base_url, http_client=client)

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

    async def get_user(self, id: int) -> UserNoPassword:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/users/{id}")
            data = response.json()
            return UserNoPassword.parse_obj(data)

    async def get_user_by_username(self, username: str) -> UserNoPassword:
        async with self.http_client() as http:
            response = await http.get(f"{self.base_url}/v0/users/{username}")
            data = response.json()
            return UserNoPassword.parse_obj(data)

    async def get_self(self) -> UserNoPassword:
        async with self.http_client() as http:
            response = await http.get(
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
        params = {}

        if id is not None:
            params["id"] = id
        if username is not None:
            params["username"] = username
        if name is not None:
            params["name"] = name
        if scopes is not None:
            params["scopes"] = scopes

        async with self.http_client() as http:
            response = await http.get(
                f"{self.base_url}/v0/users/{id}",
                params=params,
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
        async with self.http_client() as http:
            response = await http.post(
                f"{self.base_url}/v0/users/{id}",
                json=to_json_serialisable(
                    {
                        "username": username,
                        "password": password,
                        "name": name,
                        "scopes": scopes,
                    }
                ),
            )
            data = response.json()
            return UserNoPassword.parse_obj(data)

    async def update_user(
        self,
        user: UserNoPassword,
    ) -> UserNoPassword:
        async with self.http_client() as http:
            response = await http.patch(
                f"{self.base_url}/v0/users/{user.id}",
                data=user.json(encoder=to_json_serialisable),
            )
            data = response.json()
            return UserNoPassword.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> UserNoPassword:
        async with self.http_client() as http:
            await http.delete(f"{self.base_url}/v0/users/{id}")
            return None
