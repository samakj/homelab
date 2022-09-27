from typing import Union
from fastapi import Depends, HTTPException

from shared.python.models.authorisation import PermissionCredentials
from shared.python.clients.authorisation import AuthorisationClient


class BearerPermission:
    scope: list[str]

    def __init__(self, scope: Union[str, list[str]]) -> None:
        self.scope = scope if isinstance(scope, list) else [scope]

    async def __call__(
        self,
        authorisation_client: AuthorisationClient = Depends(AuthorisationClient),
    ) -> PermissionCredentials:
        bearer_user = await authorisation_client.check_token()

        full_match = True
        match = {}

        for route_scope in self.scope:
            for user_scope in bearer_user.user.scopes:
                if route_scope.startswith(user_scope):
                    match[route_scope] = user_scope
                    break
            if not match.get(route_scope):
                full_match = False
                break

        if not full_match:
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
