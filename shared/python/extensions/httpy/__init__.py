from os import access
from typing import Optional, Mapping, Callable, List, Union, Any
from fastapi import Query, Request, HTTPException

from httpx import AsyncClient, Response, USE_CLIENT_DEFAULT
from httpx._client import UseClientDefault
from httpx._config import (
    DEFAULT_TIMEOUT_CONFIG,
    DEFAULT_LIMITS,
    DEFAULT_MAX_REDIRECTS,
    Limits,
)
from httpx._types import (
    AuthTypes,
    QueryParamTypes,
    HeaderTypes,
    CookieTypes,
    VerifyTypes,
    CertTypes,
    TimeoutTypes,
    ProxiesTypes,
    URLTypes,
    RequestContent,
    RequestData,
    RequestFiles,
)
from httpx._transports.base import AsyncBaseTransport

from shared.python.config.auth import AUTH_NAME, AUTH_SCHEME


class AsyncRequestClient:
    async def __call__(self) -> AsyncClient:
        async with AsyncClient() as client:
            yield client


class AsyncInternalClient(AsyncClient):
    token: str
    headers: HeaderTypes
    cookies: CookieTypes

    def __init__(
        self,
        *,
        request: Request,
        auth: Optional[AuthTypes] = None,
        params: Optional[QueryParamTypes] = None,
        headers: Optional[HeaderTypes] = None,
        cookies: Optional[CookieTypes] = None,
        verify: VerifyTypes = True,
        cert: Optional[CertTypes] = None,
        http1: bool = True,
        http2: bool = False,
        proxies: Optional[ProxiesTypes] = None,
        mounts: Optional[Mapping[str, AsyncBaseTransport]] = None,
        timeout: TimeoutTypes = DEFAULT_TIMEOUT_CONFIG,
        follow_redirects: bool = False,
        limits: Limits = DEFAULT_LIMITS,
        max_redirects: int = DEFAULT_MAX_REDIRECTS,
        event_hooks: Optional[Mapping[str, List[Callable]]] = None,
        base_url: URLTypes = "",
        transport: Optional[AsyncBaseTransport] = None,
        app: Optional[Callable] = None,
        trust_env: bool = True,
        default_encoding: str = "utf-8",
        access_token: Optional[str] = Query(
            default=None,
            alias=AUTH_NAME,
            description="The access token to authorise the current user",
        ),
    ):
        self.headers = dict(request.headers)
        self.cookies = dict(request.cookies)
        self.token = access_token
        if self.token is None:
            self.token = request.cookies.get(AUTH_NAME)
        if self.token is None:
            self.token = request.headers.get(AUTH_NAME)
        if self.token is None:
            self.token = request.query_params.get(AUTH_NAME)

        super().__init__(
            auth=auth,
            params=params,
            headers={
                **(headers or {}),
                **self.headers,
                AUTH_NAME: f"{AUTH_SCHEME} {self.token}"
                if self.token is not None
                else "",
            },
            cookies={**(cookies or {}), **self.cookies},
            verify=verify,
            cert=cert,
            http1=http1,
            http2=http2,
            proxies=proxies,
            mounts=mounts,
            timeout=timeout,
            follow_redirects=follow_redirects,
            limits=limits,
            max_redirects=max_redirects,
            event_hooks=event_hooks,
            base_url=base_url,
            transport=transport,
            app=app,
            trust_env=trust_env,
            default_encoding=default_encoding,
        )

    async def get(
        self,
        url: URLTypes,
        *,
        params: Optional[QueryParamTypes] = None,
        headers: Optional[HeaderTypes] = None,
        cookies: Optional[CookieTypes] = None,
        auth: Union[AuthTypes, UseClientDefault, None] = USE_CLIENT_DEFAULT,
        follow_redirects: Union[bool, UseClientDefault] = USE_CLIENT_DEFAULT,
        timeout: Union[TimeoutTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        extensions: Optional[dict] = None,
    ) -> Response:
        response = await super().get(
            url=url,
            params=params,
            headers={
                **(headers or {}),
                **self.headers,
                AUTH_NAME: f"{AUTH_SCHEME} {self.token}"
                if self.token is not None
                else "",
            },
            cookies={**(cookies or {}), **self.cookies},
            auth=auth,
            follow_redirects=follow_redirects,
            timeout=timeout,
            extensions=extensions,
        )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code, detail=response.json().get("detail")
            )

        return response

    async def patch(
        self,
        url: URLTypes,
        *,
        content: Optional[RequestContent] = None,
        data: Optional[RequestData] = None,
        files: Optional[RequestFiles] = None,
        json: Optional[Any] = None,
        params: Optional[QueryParamTypes] = None,
        headers: Optional[HeaderTypes] = None,
        cookies: Optional[CookieTypes] = None,
        auth: Union[AuthTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        follow_redirects: Union[bool, UseClientDefault] = USE_CLIENT_DEFAULT,
        timeout: Union[TimeoutTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        extensions: Optional[dict] = None,
    ) -> Response:
        response = await super().patch(
            url=url,
            content=content,
            data=data,
            files=files,
            json=json,
            params=params,
            headers={
                **(headers or {}),
                **self.headers,
                AUTH_NAME: f"{AUTH_SCHEME} {self.token}"
                if self.token is not None
                else "",
            },
            cookies={**(cookies or {}), **self.cookies},
            auth=auth,
            follow_redirects=follow_redirects,
            timeout=timeout,
            extensions=extensions,
        )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code, detail=response.json().get("detail")
            )

        return response

    async def post(
        self,
        url: URLTypes,
        *,
        content: Optional[RequestContent] = None,
        data: Optional[RequestData] = None,
        files: Optional[RequestFiles] = None,
        json: Optional[Any] = None,
        params: Optional[QueryParamTypes] = None,
        headers: Optional[HeaderTypes] = None,
        cookies: Optional[CookieTypes] = None,
        auth: Union[AuthTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        follow_redirects: Union[bool, UseClientDefault] = USE_CLIENT_DEFAULT,
        timeout: Union[TimeoutTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        extensions: Optional[dict] = None,
    ) -> Response:
        response = await super().post(
            url=url,
            content=content,
            data=data,
            files=files,
            json=json,
            params=params,
            headers={
                **(headers or {}),
                **self.headers,
                AUTH_NAME: f"{AUTH_SCHEME} {self.token}"
                if self.token is not None
                else "",
            },
            cookies={**(cookies or {}), **self.cookies},
            auth=auth,
            follow_redirects=follow_redirects,
            timeout=timeout,
            extensions=extensions,
        )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code, detail=response.json().get("detail")
            )

        return response

    async def delete(
        self,
        url: URLTypes,
        *,
        params: Optional[QueryParamTypes] = None,
        headers: Optional[HeaderTypes] = None,
        cookies: Optional[CookieTypes] = None,
        auth: Union[AuthTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        follow_redirects: Union[bool, UseClientDefault] = USE_CLIENT_DEFAULT,
        timeout: Union[TimeoutTypes, UseClientDefault] = USE_CLIENT_DEFAULT,
        extensions: Optional[dict] = None,
    ) -> Response:
        response = await super().delete(
            url=url,
            params=params,
            headers={
                **(headers or {}),
                **self.headers,
                AUTH_NAME: f"{AUTH_SCHEME} {self.token}"
                if self.token is not None
                else "",
            },
            cookies={**(cookies or {}), **self.cookies},
            auth=auth,
            follow_redirects=follow_redirects,
            timeout=timeout,
            extensions=extensions,
        )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code, detail=response.json().get("detail")
            )

        return response


class AsyncInternalRequestClient:
    async def __call__(
        self,
        request: Request,
        access_token: Optional[str] = Query(
            default=None,
            alias=AUTH_NAME,
            description="The access token to authorise the current user",
        ),
    ) -> AsyncInternalClient:
        async with AsyncInternalClient(
            request=request, access_token=access_token
        ) as client:
            yield client
