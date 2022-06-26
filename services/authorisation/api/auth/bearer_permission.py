from fastapi import HTTPException, Request

from auth.bearer_user import BearerUser, UserCredentials


class PermissionCredentials(UserCredentials):
    route_scope: str
    matched_scope: str


class BearerPermission(BearerUser):
    scope: str

    def __init__(self, scope: str, auto_error: bool = True):
        super().__init__(auto_error)
        self.scope = scope

    async def __call__(self, request: Request) -> PermissionCredentials:
        bearer_user = await super().__call__(request)

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
            credentials=bearer_user.credentials,
            session=bearer_user.session,
            user=bearer_user.user,
            route_scope=self.scope,
            matched_scope=match,
        )
