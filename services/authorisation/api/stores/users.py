from typing import Optional

from asyncpg import Connection

from models.User import User
from stores.queries.users import GET_USER_BY_ID


class UsersStore:
    @staticmethod
    async def get_user(id: int, connection: Connection) -> Optional[User]:
        response = await connection.fetchrow(GET_USER_BY_ID.format(id=id))
        return User(**dict(response)) if response is not None else None
