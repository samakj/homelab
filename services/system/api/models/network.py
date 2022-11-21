from typing import Optional
from pydantic import BaseModel


class NetworkBytes(BaseModel):
    sent: int
    recieved: int


class NetworkPackets(BaseModel):
    sent: int
    recieved: int


class NetworkErrors(BaseModel):
    inbound: int
    outbound: int


class NetworkDrops(BaseModel):
    inbound: int
    outbound: int


class NetworkRates(BaseModel):
    sent: int
    recieved: int


class Network(BaseModel):
    name: str
    bytes: Optional[NetworkBytes]
    rates: Optional[NetworkRates]
    packets: Optional[NetworkPackets]
    errors: Optional[NetworkErrors]
    drops: Optional[NetworkDrops]
    ip: Optional[str]
    speed: Optional[int]
    max_speed: Optional[int]
