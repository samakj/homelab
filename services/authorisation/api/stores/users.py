from typing import Optional, Union

from asyncpg import Connection

from models.User import User
from stores.queries.users import GET_USER_BY_ID, GET_USER_BY_USERNAME, GET_USERS
from shared.python.helpers.to_filter import to_array_filter


class UsersStore:
    @staticmethod
    async def get_user(id: int, connection: Connection) -> Optional[User]:
        response = await connection.fetchrow(GET_USER_BY_ID.format(id=id))
        return User(**dict(response)) if response is not None else None

    @staticmethod
    async def get_user_by_username(
        username: str, connection: Connection
    ) -> Optional[User]:
        response = await connection.fetchrow(
            GET_USER_BY_USERNAME.format(username=username)
        )
        return User(**dict(response)) if response is not None else None

    @staticmethod
    async def get_users(
        id: Optional[Union[int, list[int]]] = None,
        username: Optional[Union[str, list[str]]] = None,
        name: Optional[Union[str, list[str]]] = None,
        scopes: Optional[Union[str, list[str]]] = None,
        connection: Optional[Connection] = None,
    ) -> Optional[User]:
        if connection is None:
            raise TypeError("DB Connection not provided.")

        where = []

        if id is not None:
            where.append(f"id IN {to_array_filter(id)}")  # make parser
        if username is not None:
            where.append(f"username IN {to_array_filter(username)}")  # make parser
        if name is not None:
            where.append(f"name IN {to_array_filter(name)}")  # make parser
        if scopes is not None:
            where.append(f"scopes @> {to_array_filter(name)}")  # make parser

        response = await connection.fetch(
            GET_USERS.format(where=" AND ".join(where) if where else "TRUE")
        )

        return [User(**dict(row)) for row in response]
