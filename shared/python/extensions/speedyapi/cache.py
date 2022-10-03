import inspect
import logging
from functools import wraps
from typing import Any, Callable, Optional
from fastapi import Request, Response
from pydantic import BaseModel
from aioredis import Redis

from shared.python.extensions.speedyapi import Logger
from shared.python.json import serialise_json, parse_json


class Cache:
    host: str
    port: str
    logger: Logger
    user: Optional[str]
    password: Optional[str]
    name: Optional[str]
    client: Optional[Redis]

    def __init__(
        self,
        host: str,
        port: str,
        user: Optional[str] = None,
        password: Optional[str] = None,
        name: Optional[str] = None,
        logger: Optional[Logger] = None,
    ) -> None:
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.name = name
        self.client = None
        self.logger = logger or logging.getLogger()

    def __call__(self) -> "Cache":
        return self

    async def initialise(self) -> None:
        self.logger.info(
            f"Connecting to cache at: redis://{self.host}:{self.port}, "
            + f"username: {self.user if self.user is not None else 'None'}"
        )

        user_prefix = ""
        cache_name_suffix = ""

        if self.user is not None:
            user_prefix = f"{self.user}"
            if self.password is not None:
                user_prefix += f":{self.password}"
            user_prefix += "@"
        if self.name is not None:
            cache_name_suffix = f"/{self.name}"

        try:
            self.client = await Redis.from_url(
                f"redis://{user_prefix}{self.host}:{self.port}{cache_name_suffix}"
            )

            self.logger.info(
                f"Connected to cache at:  redis://{self.host}:{self.port}, "
                + f"username: {self.user if self.user is not None else 'None'}"
            )
        except Exception as error:
            self.logger.error(f"Failed to connect to cache: {error}")

    async def get(self, key: str) -> Any:
        value = None

        if self.client is not None:
            try:
                cache_value = await self.client.get(key)

                if cache_value is not None:
                    value = parse_json(cache_value)
            except Exception as error:
                self.logger.error(f"Errored when getting '{key}' from cache: {error}")
        else:
            self.logger.warn("Cache not connected.")

        if value is None:
            value = await self.set(key=key)

        return value

    async def set(
        self, key: str, value: Optional[Any] = None, expiry: Optional[int] = None
    ) -> Any:
        if self.client is not None:
            if value is not None:
                try:
                    await self.client.set(key, serialise_json(value), ex=expiry)
                except Exception as error:
                    self.logger.error(f"Errored when setting '{key}' in cache: {error}")
            else:
                await self.clear(key=key)

        return value

    async def clear(self, key: str) -> None:
        if self.client is not None:
            await self.client.delete(key)

    async def clear_pattern(
        self, pattern: str, condition: Optional[Callable[[Any], bool]] = None
    ) -> None:
        if self.client is not None:
            for key in await self.client.keys(pattern):
                clear = (
                    condition(await self.get(key=key))
                    if condition is not None
                    else True
                )
                if clear:
                    await self.clear(key=key)

    def create_route_key(
        self, request: Request, include_query_params: bool = True
    ) -> str:
        key = ""
        key += request.url.hostname or ""
        key += f":{request.url.port}" if request.url.port else ""
        key += request.url.path

        if include_query_params:
            search: list[str] = []

            for key, value in request.query_params.items():
                search.append(f"{key}={value}")

            search.sort()

            key += "?"
            key += "&".join(search)

        return key

    def route(self, expiry: int = 60) -> Any:
        def decorator(func):
            signature = inspect.signature(func)
            has_request_param = next(
                (
                    param
                    for param in signature.parameters.values()
                    if param.annotation is Request
                ),
                None,
            )
            has_response_param = next(
                (
                    param
                    for param in signature.parameters.values()
                    if param.annotation is Request
                ),
                None,
            )
            parameters = [*signature.parameters.values()]
            if not has_request_param:
                parameters.append(
                    inspect.Parameter(
                        name="request",
                        annotation=Request,
                        kind=inspect.Parameter.KEYWORD_ONLY,
                    ),
                )
            if not has_response_param:
                parameters.append(
                    inspect.Parameter(
                        name="response",
                        annotation=Response,
                        kind=inspect.Parameter.KEYWORD_ONLY,
                    ),
                )
            if parameters:
                signature = signature.replace(parameters=parameters)
            func.__signature__ = signature

            @wraps(func)
            async def wrapper(*args, **kwargs):
                request = (
                    kwargs.get("request")
                    if has_request_param
                    else kwargs.pop("request")
                )
                response = (
                    kwargs.get("response")
                    if has_request_param
                    else kwargs.pop("response")
                )
                if not request:
                    self.logger.info("no-store request not cached")
                    return await func(*args, **kwargs)
                if request.headers.get("Cache-Control") == "no-store":
                    self.logger.info("no-store request not cached")
                    return await func(*args, **kwargs)
                if request.method != "GET":
                    self.logger.info("Non-get request not cached")
                    return await func(*args, **kwargs)

                response.headers["X-Will-Cache"] = "true"
                response.headers["X-Cache-Duration"] = f"{expiry}"
                key = self.create_route_key(request=request)
                cached_value = await self.get(key=key)

                if cached_value:
                    response.headers["X-Cached-Value"] = "true"
                    return cached_value

                value = await func(*args, **kwargs)

                if isinstance(value, BaseModel):
                    value = dict(value)

                return await self.set(key=key, value=value, expiry=expiry)

            return wrapper

        return decorator
