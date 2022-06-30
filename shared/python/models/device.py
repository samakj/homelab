from datetime import datetime
from typing import Optional
from pydantic import BaseModel, IPvAnyAddress, Field


class CreateDevice(BaseModel):
    mac: str = Field(description="The mac address of the device")
    ip: IPvAnyAddress = Field(description="The ip address of the device")
    websocket_path: str = Field(description="The route to the devices report websocket")
    location_id: int = Field(description="The id of the location the device is placed")
    last_message: Optional[datetime] = Field(
        description="The date of the last message sent by the device", default=None
    )


class Device(BaseModel):
    id: int = Field(description="The id of the device")
    mac: str = Field(description="The mac address of the device")
    ip: IPvAnyAddress = Field(description="The ip address of the device")
    websocket_path: str = Field(description="The route to the devices report websocket")
    location_id: int = Field(description="The id of the location the device is placed")
    last_message: Optional[datetime] = Field(
        description="The date of the last message sent by the device", default=None
    )
