from typing import Optional, Union
from fastapi import Depends, Request
from httpx import AsyncClient

from shared.python.config.auth import AUTH_COOKIE_NAME, AUTH_SCHEME
from shared.python.extensions.httpy import AsyncRequestClient
from shared.python.models.session import Session


class SessionsClient:
    client: AsyncClient
    token: Optional[str]

    def __init__(
        self,
        request: Request,
        client: AsyncRequestClient = Depends(AsyncRequestClient()),
    ) -> None:
        self.client = client
        self.token = request.cookies.get(AUTH_COOKIE_NAME)

    async def get_session(self, id: int) -> Session:
        response = await self.client.get(
            f"/v0/sessions/{id}",
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return Session.parse_obj(data)

    async def get_sessions(
        self,
        id: Optional[Union[int, list[int]]] = None,
        user_id: Optional[Union[int, list[int]]] = None,
        ip: Optional[Union[str, list[str]]] = None,
    ) -> list[Session]:
        response = await self.client.get(
            f"/v0/sessions/{id}",
            params={"id": id, "user_id": user_id, "ip": ip},
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return [Session.parse_obj(user) for user in data]

    async def create_session(
        self,
        user_id: int,
        ip: str,
    ) -> Session:
        response = await self.client.post(
            f"/v0/sessions/{id}",
            data={
                "user_id": user_id,
                "ip": ip,
            },
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return Session.parse_obj(data)

    async def update_user(
        self,
        session: Session,
    ) -> Session:
        response = await self.client.patch(
            f"/v0/sessions/{session.id}",
            data=dict(session),
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        data = response.json()
        return Session.parse_obj(data)

    async def delete_user(
        self,
        id: int,
    ) -> None:
        await self.client.delete(
            f"/v0/sessions/{id}",
            cookies={AUTH_COOKIE_NAME: f"{AUTH_SCHEME} {self.token}"},
        )
        return None
