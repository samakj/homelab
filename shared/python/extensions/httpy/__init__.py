from httpx import AsyncClient


class AsyncRequestClient:
    async def __call__(self) -> AsyncClient:
        async with AsyncClient() as client:
            yield client
