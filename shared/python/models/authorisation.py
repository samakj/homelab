from pydantic import BaseModel, Field
from shared.python.models.session import Session
from shared.python.models.user import User, UserNoPassword


class JWTAuthorizationCredentials(BaseModel):
    scheme: str = Field(description="The scheme provided in the auth cookie")
    token: str = Field(description="The token provided in the auth cookie")
    session: Session = Field(description="The parsed session from the token")

    class Config:
        orm_mode = True


class UserCredentials(JWTAuthorizationCredentials):
    user: User = Field(description="The user in the session.")

    class Config:
        orm_mode = True


class PermissionCredentials(UserCredentials):
    route_scope: str = Field(description="The required scope for the route")
    matched_scope: str = Field(
        description="The user scope that matched to the route scope"
    )

    class Config:
        orm_mode = True


class LoginResponse(BaseModel):
    access_token: str
    user: UserNoPassword
    session: Session

    class Config:
        orm_mode = True


class LogoutResponse(BaseModel):
    session: Session

    class Config:
        orm_mode = True
