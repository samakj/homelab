from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from stores.sessions import SessionsStore
from models.Session import Session, CreateSession


SESSIONS_V0_ROUTER = APIRouter(prefix="/v0/sessions", tags=["sessions"])


@SESSIONS_V0_ROUTER.get("/{id:int}", response_model=Session)
async def get_session(
    id: int, sessions_store: SessionsStore = Depends(SessionsStore)
) -> Session:
    session = await sessions_store.get_session(id=id)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")

    return session


@SESSIONS_V0_ROUTER.get("/", response_model=list[Session])
async def get_sessions(
    id: Optional[list[int]] = Query(None),
    user_id: Optional[list[int]] = Query(None),
    ip: Optional[list[str]] = Query(None),
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> Session:
    session = await sessions_store.get_sessions(id=id, user_id=user_id, ip=ip)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")

    return session


@SESSIONS_V0_ROUTER.post("/", response_model=Session)
async def create_session(
    session: CreateSession,
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> Session:
    session = await sessions_store.create_session(session=session)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")

    return session


@SESSIONS_V0_ROUTER.patch("/{id:int}", response_model=Session)
async def update_session(
    id: int,
    session: Session,
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> Session:
    session = await sessions_store.update_session(session=session)

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")

    return session


@SESSIONS_V0_ROUTER.delete("/{id:int}")
async def delete_session(
    id: int,
    sessions_store: SessionsStore = Depends(SessionsStore),
) -> Session:
    await sessions_store.delete_session(id=id)
    return None
