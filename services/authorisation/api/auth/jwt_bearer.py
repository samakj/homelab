from datetime import datetime
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from auth.jwt import decode_jwt
from models.Session import Session
from stores.sessions import SessionsStore


class JWTAuthorizationCredentials(HTTPAuthorizationCredentials):
    session: Session


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(
        self, request: Request, sessions_store: SessionsStore = Depends(SessionsStore)
    ) -> JWTAuthorizationCredentials:
        credentials = await super(JWTBearer, self).__call__(request)

        if not credentials:
            raise HTTPException(status_code=401, detail="Invalid authorisation")
        if credentials.schema == "Bearer":  # type: ignore
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        payload = None

        try:
            payload = decode_jwt(
                token=credentials.credentials, config=request.app.config
            )
        except TypeError as error:
            raise HTTPException(status_code=500, detail=f"JWT decode failed: {error}")

        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        if payload.get("session_id", None):
            raise HTTPException(status_code=401, detail="Invalid session")

        session = await sessions_store.get_session(id=payload.id)

        if session is None:
            raise HTTPException(status_code=401, detail="Invalid session")
        if session.expires <= datetime.utcnow():
            raise HTTPException(status_code=401, detail="Session expired")

        return JWTAuthorizationCredentials(
            scheme=credentials.scheme,
            credentials=credentials.credentials,
            session=session,
        )
