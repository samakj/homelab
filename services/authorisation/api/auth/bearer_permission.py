from fastapi import Depends, HTTPException, Request

from auth.bearer_user import BearerUser, UserCredentials
from stores.users import UsersStore
from stores.sessions import SessionsStore


class PermissionCredentials(UserCredentials):
    route_scope: str
    matched_scope: str


class BearerPermission(BearerUser):
    scope: str

    def __init__(self, scope: str):
        super().__init__()
        self.scope = scope

    async def __call__(
        self,
        request: Request,
        users_store: UsersStore = Depends(UsersStore),
        sessions_store: SessionsStore = Depends(SessionsStore),
    ) -> PermissionCredentials:
        bearer_user = await super().__call__(
            request=request, users_store=users_store, sessions_store=sessions_store
        )

        match = None

        for scope in bearer_user.user.scopes:
            if self.scope.startswith(scope):
                match = scope
                break

        if match is None:
            raise HTTPException(
                status_code=403, detail="User does not have access to this resource"
            )

        return PermissionCredentials(
            scheme=bearer_user.scheme,
            token=bearer_user.token,
            session=bearer_user.session,
            user=bearer_user.user,
            route_scope=self.scope,
            matched_scope=match,
        )
