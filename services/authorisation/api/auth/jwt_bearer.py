from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from auth.jwt import decode_jwt
from models.Session import Session


class JWTAuthorizationCredentials(HTTPAuthorizationCredentials):
    session: Session


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> JWTAuthorizationCredentials:
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

        return JWTAuthorizationCredentials(
            scheme=credentials.scheme,
            credentials=credentials.credentials,
            session=payload,
        )
