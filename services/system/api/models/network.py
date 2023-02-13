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


class NetworkCardConfiguration(BaseModel):
    broadcast: str
    driver: str
    driverversion: str
    firmware: str
    ip: str
    latency: str
    link: str
    multicast: str
    autonegotiation: Optional[str] = None
    duplex: Optional[str] = None
    port: Optional[str] = None
    speed: Optional[str] = None


class NetworkCard(BaseModel):
    id: str
    claimed: bool
    handle: str
    description: str
    product: str
    vendor: str
    physid: str
    businfo: str
    logicalname: str
    version: str
    serial: str
    width: int
    clock: int
    configuration: NetworkCardConfiguration
    capabilities: dict[str, str]
    units: Optional[str] = None
    size: Optional[int] = None
    capacity: Optional[int] = None
