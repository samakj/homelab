from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from shared.python.terminal.formatting import (
    GREEN,
    CYAN,
    BLUE,
    RED,
    YELLOW,
    BOLD,
    RESET,
)

request_method_colour = {
    "GET": GREEN,
    "DELETE": RED,
    "PATCH": CYAN,
    "POST": BLUE,
    "OPTIONS": YELLOW,
}

status_code_colour = {"2": GREEN, "3": YELLOW, "4": RED, "5": RED}


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)
        request.app.logger.info(
            f"{request_method_colour.get(request.method, '')}{request.method}{RESET} "
            + f"{request.url.scheme}://  "
            + f"{request.url.hostname}  "
            + f"{BOLD}{request.url.path}{RESET} - "
            + f"{request.client.host if request.client is not None else 'unknown'} - "
            + f"{response.headers['X-Request-Id']}"
        )
        request.app.logger.info(
            f"  ↳ {status_code_colour[str(response.status_code)[0]]}{response.status_code}{RESET} - "
            + f"{response.headers['X-Request-Duration']}ms"
        )

        return response
