from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Response, Request
from pydantic import BaseModel

from auth.config import AUTH_COOKIE_NAME, AUTH_SCHEME, SESSION_DURATION
from auth.jwt import sign_jwt
from stores.users import UsersStore
from stores.sessions import SessionsStore
from models.User import UserNoPassword
from models.Session import CreateSession


LOGIN_V0_ROUTER = APIRouter(prefix="/v0", tags=["login"])


class LoginDetails(BaseModel):
    username: str
    password: str


@LOGIN_V0_ROUTER.post("/login", response_model=UserNoPassword)
async def get_user(
    details: LoginDetails,
    request: Request,
    response: Response,
    users_store: UsersStore = Depends(UsersStore),
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> UserNoPassword:
    if not request.client:
        raise HTTPException(status_code=401, detail="Client could not be determined.")

    user = await users_store.verify_user_password(
        username=details.username, password=details.password
    )

    if user is None:
        raise HTTPException(status_code=401, detail="Log in failed.")

    session = await sessions_store.create_session(
        session=CreateSession(
            user_id=user.id,
            expires=datetime.utcnow() + SESSION_DURATION,
            ip=request.client.host,
        )
    )
    jwt_token = sign_jwt(
        payload={"session_id": session.id, "expires": session.expires.isoformat()},
        config=request.app.config,
    )

    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=f"{AUTH_SCHEME} {jwt_token}",
        httponly=True,
    )
    return UserNoPassword.parse_obj(dict(user))
