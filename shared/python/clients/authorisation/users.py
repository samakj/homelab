from typing import Optional, Union
from fastapi import Depends, Request
from httpx import AsyncClient

from shared.python.config.auth import AUTH_COOKIE_NAME, AUTH_SCHEME
from shared.python.extensions.httpy import AsyncRequestClient
from shared.python.models.user import UserNoPassword


class UsersClient:
    client: AsyncClient
    token: Optional[str]

    def __init__(
        self,
        request: Request,
        client: AsyncRequestClient = Depends(AsyncRequestClient()),
    ) -> None:
        self.client = client
        self.token = request.cookies.get(AUTH_COOKIE_NAME)

    async def get_user(self, id: int) -> UserNoPassword:
        response = await self.client.get(
            f"/v0/users/{id}", cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"}
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def get_user_by_username(self, username: str) -> UserNoPassword:
        response = await self.client.get(
            f"/v0/users/{username}",
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def get_self(self) -> UserNoPassword:
        response = await self.client.get(
            "/v0/users/self", cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"}
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
            f"/v0/users/{id}",
            params={"id": id, "username": username, "name": name, "scopes": scopes},
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
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
            f"/v0/users/{id}",
            data={
                "username": username,
                "password": password,
                "name": name,
                "scopes": scopes,
            },
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def update_user(
        self,
        user: UserNoPassword,
    ) -> UserNoPassword:
        response = await self.client.patch(
            f"/v0/users/{user.id}",
            data=dict(user),
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return UserNoPassword.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> UserNoPassword:
        await self.client.delete(
            f"/v0/users/{id}",
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        return None
