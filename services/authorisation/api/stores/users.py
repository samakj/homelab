from typing import Optional, Union

from asyncpg import Connection
from fastapi import Depends

from database import Database
from models.User import User, CreateUser
from auth.passwords import hash_password
from stores.queries.users import (
    GET_USER_BY_ID,
    GET_USER_BY_USERNAME,
    GET_USERS,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
)
from shared.python.helpers.to_filter import to_filter, to_array_filter


class UsersStore:
    connection: Connection

    def __init__(self, connection: Connection = Depends(Database.transaction)) -> None:
        self.connection = connection

    async def get_user(self, id: int) -> Optional[User]:
        response = await self.connection.fetchrow(
            GET_USER_BY_ID.format(id=to_filter(id))
        )
        return User(**dict(response)) if response is not None else None

    async def get_user_by_username(self, username: str) -> Optional[User]:
        response = await self.connection.fetchrow(
            GET_USER_BY_USERNAME.format(username=to_filter(username))
        )
        return User(**dict(response)) if response is not None else None

    async def get_users(
        self,
        id: Optional[Union[int, list[int]]] = None,
        username: Optional[Union[str, list[str]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        scopes: Optional[Union[str, list[str]]] = None,
    ) -> Optional[User]:
        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")  # make parser
        if username is not None:
            where.append(f"username IN {to_array_filter(username)}")  # make parser
        if name is not None:
            where.append(f"name IN {to_array_filter(name)}")  # make parser
        if scopes is not None:
            where.append(f"scopes @> {to_array_filter(name)}")  # make parser

        response = await self.connection.fetch(
            GET_USERS.format(where=" AND ".join(where) if where else "TRUE")
        )

        return [User(**dict(row)) for row in response]

    async def create_user(
        self,
        user: CreateUser,
    ) -> Optional[User]:
        await self.connection.execute(
            CREATE_USER.format(
                username=to_filter(user.username),
                password=to_filter(hash_password(user.password)),
                name=to_filter(user.name),
                scopes=to_array_filter(user.scopes),
            )
        )
        return await self.get_user_by_username(username=user.username)

    async def update_user(self, user: User) -> Optional[User]:
        await self.connection.execute(
            UPDATE_USER.format(
                id=to_filter(user.id),
                username=to_filter(user.username),
                password=to_filter(hash_password(user.password)),
                name=to_filter(user.name),
                scopes=to_array_filter(user.scopes),
            )
        )
        return await self.get_user_by_username(username=user.username)

    async def delete_user(self, id: int) -> None:
        await self.connection.execute(DELETE_USER.format(id=to_filter(id)))
