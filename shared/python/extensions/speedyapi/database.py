import asyncpg
from asyncpg import Connection, Pool
from fastapi import HTTPException
from fastapi.requests import HTTPConnection


class Database:
    user: str
    password: str
    host: str
    port: str
    name: str
    pool: Pool

    def __init__(
        self,
        user: str,
        password: str,
        host: str,
        port: str,
        name: str,
    ) -> None:
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.name = name

    async def initialise(self) -> None:
        self.pool = await asyncpg.create_pool(
            dsn=(
                "postgresql://"
                + f"{self.user}:{self.password}@"
                + f"{self.host}:{self.port}/"
                + f"{self.name}"
            )
        )

    @staticmethod
    def raise_database_http_error(error: Exception) -> None:
        if isinstance(error, asyncpg.ForeignKeyViolationError):
            raise HTTPException(status_code=400, detail=str(error))
        raise error

    @staticmethod
    async def connection(
        http_connection: HTTPConnection,
    ) -> Connection:
        async with http_connection.app.db.pool.acquire() as connection:
            try:
                yield connection
            except Exception as error:
                Database.raise_database_http_error(error=error)

    @staticmethod
    async def transaction(
        http_connection: HTTPConnection,
    ) -> Connection:
        async with http_connection.app.db.pool.acquire() as connection:
            async with connection.transaction():
                try:
                    yield connection
                except Exception as error:
                    Database.raise_database_http_error(error=error)
