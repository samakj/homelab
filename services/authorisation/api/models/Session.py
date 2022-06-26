from datetime import datetime
from pydantic import BaseModel, Field


class CreateSession(BaseModel):
    user_id: int = Field(description="The id of the user the session is for.")
    expires: datetime = Field(description="The expiry date of the session.")
    ip: str = Field(description="The ip attatched to the session.")


class Session(BaseModel):
    id: int = Field(description="The session id.")
    user_id: int = Field(description="The id of the user the session is for.")
    expires: datetime = Field(description="The expiry date of the session.")
    ip: str = Field(description="The ip attatched to the session.")
