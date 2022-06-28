from typing import List
from pydantic import BaseModel, Field


class Location(BaseModel):
    id: int = Field(description="The id of the location")
    name: str = Field(description="The name of the location")
    tags: List[str] = Field(description="A list of tags for the location")
