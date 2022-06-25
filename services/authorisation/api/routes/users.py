from typing import Optional
from asyncpg import Connection
from fastapi import APIRouter, HTTPException, Query, Request, Depends

from database import Database
from models.User import User, CreateUser


USERS_V0_ROUTER = APIRouter(prefix="/v0/users", tags=["users"])


@USERS_V0_ROUTER.get("/{id:int}", response_model=User)
async def get_user(
    id: int, request: Request, connection: Connection = Depends(Database.transaction)
) -> User:
    user = await request.app.users_store.get_user(id=id, connection=connection)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.get("/{username:str}", response_model=User)
async def get_user_by_username(
    username: str,
    request: Request,
    connection: Connection = Depends(Database.transaction),
) -> User:
    user = await request.app.users_store.get_user_by_username(
        username=username, connection=connection
    )

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.get("/", response_model=list[User])
async def get_users(
    request: Request,
    id: Optional[list[int]] = Query(None),
    username: Optional[list[str]] = Query(None),
    name: Optional[list[str]] = Query(None),
    scopes: Optional[list[str]] = Query(None),
    connection: Connection = Depends(Database.transaction),
) -> User:
    user = await request.app.users_store.get_users(
        id=id, username=username, name=name, scopes=scopes, connection=connection
    )

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


@USERS_V0_ROUTER.post("/", response_model=User)
async def create_user(
    request: Request,
    user: CreateUser,
    connection: Connection = Depends(Database.transaction),
) -> User:
    user = await request.app.users_store.create_user(user=user, connection=connection)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user
