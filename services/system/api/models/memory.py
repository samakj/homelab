from pydantic import BaseModel


class Memory(BaseModel):
    total: int
    available: int
    utilisation: float
    used: int
    free: int
    active: int
    inactive: int
    buffers: int
    cached: int
    shared: int
    slab: int
