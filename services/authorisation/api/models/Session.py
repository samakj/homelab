from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class Session(BaseModel):
    id: int = Field(description="The session id.")
    user_id: int = Field(description="The id of the user the session is for.")
    expires: datetime = Field(description="The expiry date of the session.")
    ip: str = Field(description="The ip attatched to the session.")
    scopes: List[str] = Field(
        description="The scopes that the user has access to.", default=[]
    )
