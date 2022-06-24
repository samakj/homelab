import asyncpg
from asyncpg import Connection, Pool
from fastapi import Request


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
    async def connection(request: Request) -> Connection:
        async with request.app.db.pool.acquire() as connection:
            yield connection

    @staticmethod
    async def transaction(request: Request) -> Connection:
        async with request.app.db.pool.acquire() as connection:
            async with connection.transaction():
                yield connection
