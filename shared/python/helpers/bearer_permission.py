from fastapi import Depends, HTTPException

from shared.python.models.authorisation import PermissionCredentials
from shared.python.clients.authorisation import AuthorisationClient


class BearerPermission:
    scope: str

    def __init__(self, scope: str) -> None:
        self.scope = scope

    async def __call__(
        self,
        authorisation_client: AuthorisationClient = Depends(AuthorisationClient),
    ) -> PermissionCredentials:
        bearer_user = await authorisation_client.check_token()

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
