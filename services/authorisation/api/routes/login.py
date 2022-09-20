from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Response, Request
from pydantic import BaseModel

from shared.python.config.auth import AUTH_NAME, AUTH_SCHEME
from auth.jwt import sign_jwt
from auth.bearer_user import BearerUser, UserCredentials
from stores.users import UsersStore
from stores.sessions import SessionsStore
from shared.python.models.authorisation import LoginResponse
from shared.python.models.session import CreateSession, Session
from shared.python.models.user import User, UserNoPassword


LOGIN_V0_ROUTER = APIRouter(prefix="/v0", tags=["login"])


class LoginDetails(BaseModel):
    username: str
    password: str


@LOGIN_V0_ROUTER.post("/login", response_model=LoginResponse)
async def login(
    details: LoginDetails,
    request: Request,
    response: Response,
    users_store: UsersStore = Depends(UsersStore),
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> LoginResponse:
    if not request.client:
        request.app.logger.error("Client could not be determined on protected route.")
        raise HTTPException(status_code=401, detail="Client could not be determined.")

    user = await users_store.verify_user_password(
        username=details.username, password=details.password
    )

    if user is None:
        request.app.logger.error("User password could not be verified.")
        raise HTTPException(status_code=401, detail="Log in failed.")

    old_sessions = await sessions_store.get_sessions(
        expires_gte=datetime.utcnow(), disabled=False
    )
    for session in old_sessions:
        await sessions_store.update_session(
            Session(
                id=session.id,
                user_id=session.user_id,
                created=session.created,
                expires=session.expires,
                ip=session.ip,
                disabled=True,
            )
        )

    session = await sessions_store.create_session(
        session=CreateSession(
            user_id=user.id,
            ip=request.headers.get("X-Real-IP"),
        )
    )
    jwt_token = sign_jwt(
        payload={"session_id": session.id, "expires": session.expires.isoformat()},
        config=request.app.config,
    )

    response.set_cookie(
        key=AUTH_NAME,
        value=f"{AUTH_SCHEME} {jwt_token}",
        httponly=True,
    )
    response.headers.append(key=AUTH_NAME, value=f"{AUTH_SCHEME} {jwt_token}")
    return LoginResponse(
        access_token=jwt_token,
        user=UserNoPassword(
            id=user.id,
            username=user.username,
            name=user.name,
            scopes=user.scopes,
        ),
        session=session,
    )


@LOGIN_V0_ROUTER.get("/token", response_model=UserCredentials)
async def check_token(
    user_credentials: UserCredentials = Depends(BearerUser()),
) -> UserCredentials:
    return UserCredentials(
        scheme=user_credentials.scheme,
        token=user_credentials.token,
        session=user_credentials.session,
        user=User(
            id=user_credentials.user.id,
            username=user_credentials.user.username,
            password="",
            name=user_credentials.user.name,
            scopes=user_credentials.user.scopes,
        ),
    )
