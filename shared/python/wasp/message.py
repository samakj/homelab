from decimal import Decimal
from enum import Enum
from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class WaspRequestMethod(str, Enum):
    GET = "GET"
    LISTEN = "LISTEN"
    UPDATE = "UPDATE"
    CREATE = "CREATE"
    DELETE = "DELETE"


class WaspRequest(BaseModel):
    id: str
    uri: str
    method: WaspRequestMethod
    data: Optional[BaseModel] = None
    query: Optional[BaseModel] = None


class WaspResponseStatus(BaseModel):
    ok: bool
    code: int
    message: Optional[str] = None


class WaspResponseMeta(BaseModel):
    start: datetime
    end: datetime
    duration: Decimal


class WaspResponse(BaseModel):
    request: WaspRequest
    data: list[BaseModel]
    status: WaspResponseStatus
    meta: WaspResponseMeta
