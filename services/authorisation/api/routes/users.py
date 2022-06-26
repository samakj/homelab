from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from stores.users import UsersStore
from models.User import User, CreateUser


USERS_V0_ROUTER = APIRouter(prefix="/v0/users", tags=["users"])


@USERS_V0_ROUTER.get("/{id:int}", response_model=User)
async def get_user(id: int, users_store: UsersStore = Depends(UsersStore)) -> User:
    user = await users_store.get_user(id=id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.get("/{username:str}", response_model=User)
async def get_user_by_username(
    username: str, users_store: UsersStore = Depends(UsersStore)
) -> User:
    user = await users_store.get_user_by_username(username=username)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.get("/", response_model=list[User])
async def get_users(
    id: Optional[list[int]] = Query(None),
    username: Optional[list[str]] = Query(None),
    name: Optional[list[str]] = Query(None),
    scopes: Optional[list[str]] = Query(None),
    users_store: UsersStore = Depends(UsersStore),
) -> User:
    user = await users_store.get_users(
        id=id, username=username, name=name, scopes=scopes
    )

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.post("/", response_model=User)
async def create_user(
    user: CreateUser,
    users_store: UsersStore = Depends(UsersStore),
) -> User:
    user = await users_store.create_user(user=user)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user
