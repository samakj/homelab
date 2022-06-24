from asyncpg import Connection
from fastapi import APIRouter, HTTPException, Request, Depends

from database import Database
from models.User import User


USERS_V0_ROUTER = APIRouter(prefix="/v0/users", tags=["users"])


@USERS_V0_ROUTER.get("/{id:int}", response_model=User)
async def get_user(
    id: int, request: Request, connection: Connection = Depends(Database.transaction)
) -> User:
    user = await request.app.users_store.get_user(id=id, connection=connection)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")

    return user
