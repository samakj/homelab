from datetime import datetime
from fastapi import Depends, Request, HTTPException

from auth.config import AUTH_COOKIE_NAME, AUTH_SCHEME
from auth.jwt import decode_jwt
from stores.sessions import SessionsStore
from shared.python.models.authorisation import JWTAuthorizationCredentials


class JWTBearer:
    async def __call__(
        self, request: Request, sessions_store: SessionsStore = Depends(SessionsStore)
    ) -> JWTAuthorizationCredentials:
        if not request.client:
            raise HTTPException(
                status_code=401, detail="Client could not be determined."
            )

        cookie = request.cookies.get(AUTH_COOKIE_NAME)

        if cookie is None:
            raise HTTPException(status_code=401, detail="Invalid authorisation")

        scheme, token = cookie.split(" ")

        if scheme != AUTH_SCHEME:
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        payload = None

        try:
            payload = decode_jwt(token=token, config=request.app.config)
        except TypeError as error:
            raise HTTPException(status_code=500, detail=f"JWT decode failed: {error}")

        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        if payload.get("session_id") is None:
            raise HTTPException(status_code=401, detail="Invalid session")

        session = await sessions_store.get_session(id=payload.get("session_id"))

        if session is None:
            raise HTTPException(status_code=401, detail="Invalid session")
        if session.ip != request.client.host:
            raise HTTPException(status_code=401, detail="Invalid session")
        if session.expires <= datetime.utcnow():
            raise HTTPException(status_code=401, detail="Session expired")
        if session.disabled:
            raise HTTPException(status_code=401, detail="Session expired")

        return JWTAuthorizationCredentials(
            scheme=scheme,
            token=token,
            session=session,
        )
