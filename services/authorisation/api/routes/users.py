from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from auth.bearer_permission import BearerPermission, PermissionCredentials
from stores.users import UsersStore
from models.User import User, CreateUser, UserNoPassword


USERS_V0_ROUTER = APIRouter(prefix="/v0/users", tags=["users"])


@USERS_V0_ROUTER.get("/{id:int}", response_model=UserNoPassword)
async def get_user(
    id: int,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="users.get")),
) -> UserNoPassword:
    user = await users_store.get_user(id=id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.get("/self", response_model=UserNoPassword)
async def get_self(
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="users.self")),
) -> UserNoPassword:
    user = await users_store.get_user(id=permissions.user.id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.get("/{username:str}", response_model=UserNoPassword)
async def get_user_by_username(
    username: str,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="users.get")),
) -> UserNoPassword:
    user = await users_store.get_user_by_username(username=username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.get("/", response_model=list[UserNoPassword])
async def get_users(
    id: Optional[list[int]] = Query(None),
    username: Optional[list[str]] = Query(None),
    name: Optional[list[str]] = Query(None),
    scopes: Optional[list[str]] = Query(None),
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="users.get")),
) -> UserNoPassword:
    users = await users_store.get_users(
        id=id, username=username, name=name, scopes=scopes
    )

    return [UserNoPassword.parse_obj(dict(user)) for user in users]


@USERS_V0_ROUTER.post("/", response_model=UserNoPassword)
async def create_user(
    user: CreateUser,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="users.create")
    ),
) -> UserNoPassword:
    user = await users_store.create_user(user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.patch("/{id:int}", response_model=UserNoPassword)
async def update_user(
    id: int,
    user: UserNoPassword,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="users.update")
    ),
) -> UserNoPassword:
    user = await users_store.update_user(user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.patch("/{id:int}/password", response_model=UserNoPassword)
async def update_user_password(
    id: int,
    user: User,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="users.update")
    ),
) -> UserNoPassword:
    user = await users_store.update_user_password(user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return UserNoPassword.parse_obj(dict(user))


@USERS_V0_ROUTER.delete("/{id:int}")
async def delete_user(
    id: int,
    users_store: UsersStore = Depends(UsersStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="users.delete")
    ),
) -> None:
    await users_store.delete_user(id=id)
    return None
