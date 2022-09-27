from datetime import datetime
from typing import Optional
from fastapi import Depends, Query, Request, HTTPException

from shared.python.config.auth import AUTH_NAME, AUTH_SCHEME
from auth.jwt import decode_jwt
from stores.sessions import SessionsStore
from shared.python.models.authorisation import JWTAuthorizationCredentials


class JWTBearer:
    async def __call__(
        self,
        request: Request,
        access_token: Optional[str] = Query(
            default=None,
            alias=AUTH_NAME,
            description="The access token to authorise the current user",
        ),
        sessions_store: SessionsStore = Depends(SessionsStore),
    ) -> JWTAuthorizationCredentials:
        if not request.client:
            request.app.logger.error(
                "Client could not be determined on protected route."
            )
            raise HTTPException(
                status_code=401, detail="Client could not be determined."
            )

        auth = request.cookies.get(AUTH_NAME)

        if auth is None:
            auth = request.headers.get(AUTH_NAME)
        if auth is None and access_token is not None:
            auth = f"{AUTH_SCHEME} {access_token}"

        if auth is None:
            request.app.logger.error(
                "Auth not sent in cookie, headers or query on protected route."
            )
            raise HTTPException(status_code=401, detail="Invalid authorisation")
        if auth == "":
            request.app.logger.error(
                "Empty auth in cookie, headers or query on protected route."
            )
            raise HTTPException(status_code=401, detail="Invalid authorisation")

        scheme, token = auth.split(" ")

        if scheme != AUTH_SCHEME:
            request.app.logger.error(
                "Invalid authentication scheme on protected route."
            )
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        payload = None

        try:
            payload = decode_jwt(token=token, config=request.app.config)
        except TypeError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        if payload is None:
            request.app.logger.error("Invalid config variables.")
            raise HTTPException(status_code=500, detail="JWT decode failed")
        if payload.get("session_id") is None:
            request.app.logger.error("No session id in token on protected route.")
            raise HTTPException(status_code=401, detail="Invalid session")

        session = await sessions_store.get_session(id=payload.get("session_id"))

        if session is None:
            request.app.logger.error("Session not found in db on protected route.")
            raise HTTPException(status_code=401, detail="Invalid session")

        if session.ip != request.headers.get("X-Real-IP"):
            request.app.logger.error(
                f"Session IP ({session.ip}) does not match client "
                + f"({request.headers.get('X-Real-IP')}) on protected route."
            )
            raise HTTPException(status_code=401, detail="Invalid session")
        if session.expires <= datetime.utcnow():
            request.app.logger.error(
                f"Session expired ({session.expires.isoformat()}) on protected route."
            )
            raise HTTPException(status_code=401, detail="Session expired")
        if session.disabled:
            request.app.logger.error("Session disabled on protected route.")
            raise HTTPException(status_code=401, detail="Session expired")

        return JWTAuthorizationCredentials(
            scheme=scheme,
            token=token,
            session=session,
        )
