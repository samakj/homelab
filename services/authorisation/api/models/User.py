from typing import List
from pydantic import BaseModel, Field


class User(BaseModel):
    id: int = Field(description="The users id.")
    username: str = Field(description="The users username.")
    password: str = Field(description="The users password.")
    name: str = Field(description="The informal name to use for users.")
    scopes: List[str] = Field(
        description="The scopes that the user has access to.", default=[]
    )
