from os import access
from typing import Optional
from fastapi import Query, HTTPException
from fastapi.requests import HTTPConnection

from httpx import AsyncClient, Response, Request

from shared.python.config.auth import AUTH_NAME, AUTH_SCHEME


class AsyncRequestClient:
    access_token: Optional[str]
    headers: dict[str, str]
    cookies: dict[str, str]

    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token
        self.cookies = {}
        self.headers = {}
        self.headers["accept"] = "application/json"
        self.headers["Content-Type"] = "application/json"

    def __call__(self) -> AsyncClient:
        return AsyncClient(
            cookies=self.cookies,
            event_hooks={
                "request": [self.inject_headers],
                "response": [self.raise_for_status],
            },
            follow_redirects=True,
        )

    @staticmethod
    async def raise_for_status(response: Response) -> None:
        if response.status_code >= 400:
            detail = None
            await response.aread()
            try:
                detail = response.json()
                detail = detail.get("detail", detail)
            except Exception:
                detail = response.text
            raise HTTPException(status_code=response.status_code, detail=detail)

    async def inject_headers(self, request: Request) -> None:
        for key, value in self.headers.items():
            request.headers[key] = value

        if self.access_token:
            request.headers[AUTH_NAME] = f"{AUTH_SCHEME} {self.access_token}"

    def set_access_token(self, access_token: Optional[str] = None) -> None:
        self.access_token = access_token


class AsyncRequestForwardingClient(AsyncRequestClient):
    def __init__(
        self,
        http_connection: HTTPConnection,
        access_token: Optional[str] = Query(default=None),
    ):
        if not access_token:
            access_token = http_connection.headers.get(AUTH_NAME, "").replace(
                f"{AUTH_SCHEME} ", ""
            )
        if not access_token:
            access_token = http_connection.cookies.get(AUTH_NAME, "").replace(
                f"{AUTH_SCHEME} ", ""
            )

        super().__init__(access_token=access_token or None)
        self.cookies = {**self.cookies, **http_connection.cookies}

        request_headers = dict(http_connection.headers)

        #  Client
        # if request_headers.get("host") is not None:
        #     headers["host"] = request_headers["host"]
        if request_headers.get("origin") is not None:
            self.headers["origin"] = request_headers["origin"]
        if request_headers.get("user-agent") is not None:
            self.headers["user-agent"] = request_headers["user-agent"]

        # Cache
        if request_headers.get("pragma") is not None:
            self.headers["pragma"] = request_headers["pragma"]
        if request_headers.get("cache-control") is not None:
            self.headers["cache-control"] = request_headers["cache-control"]

        # Meta
        if request_headers.get("accept-encoding") is not None:
            self.headers["accept-encoding"] = request_headers["accept-encoding"]
        if request_headers.get("accept-language") is not None:
            self.headers["accept-language"] = request_headers["accept-language"]

        # Nginx
        if request_headers.get("x-real-ip") is not None:
            self.headers["x-real-ip"] = request_headers["x-real-ip"]
        if request_headers.get("x-forwarded-proto") is not None:
            self.headers["x-forwarded-proto"] = request_headers["x-forwarded-proto"]
        if request_headers.get("x-forwarded-host") is not None:
            self.headers["x-forwarded-host"] = request_headers["x-forwarded-host"]
        if request_headers.get("x-forwarded-server") is not None:
            self.headers["x-forwarded-server"] = request_headers["x-forwarded-server"]
        if request_headers.get("x-forwarded-for") is not None:
            self.headers["x-forwarded-for"] = request_headers["x-forwarded-for"]
