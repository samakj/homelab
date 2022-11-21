from typing import Optional
from pydantic import BaseModel


class DiskSpace(BaseModel):
    total: int
    used: int
    free: int


class DiskOperations(BaseModel):
    read: int
    write: int


class DiskBytes(BaseModel):
    read: int
    write: int


class DiskTimes(BaseModel):
    read: int
    write: int


class DiskRates(BaseModel):
    read: float
    write: float


class Disk(BaseModel):
    name: str
    device: Optional[str]
    path: Optional[str]
    filesystem: Optional[str]
    options: Optional[str]
    maxfile: Optional[int]
    maxpath: Optional[int]
    utilisation: Optional[float]
    space: Optional[DiskSpace]
    operations: Optional[DiskOperations]
    bytes: Optional[DiskBytes]
    times: Optional[DiskTimes]
    rates: Optional[DiskRates]
