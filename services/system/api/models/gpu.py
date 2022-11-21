from typing import Optional
from pydantic import BaseModel


class GPUClocks(BaseModel):
    gpu: float
    memory: Optional[float]
    video: Optional[float]
    sm: Optional[float]


class GPUPowerLimits(BaseModel):
    max: Optional[float]
    min: Optional[float]
    current: Optional[float]
    default: Optional[float]


class GPUTemperatureThresholds(BaseModel):
    min: Optional[float]
    max: Optional[float]
    gpu: Optional[float]
    slow: Optional[float]


class GPUEncoder(BaseModel):
    utilisation: float


class GPUDencoder(BaseModel):
    utilisation: float


class GPUMemory(BaseModel):
    total: float
    reserved: float
    used: float
    free: float
    utilisation: float
    temperature: Optional[float]
    temperature_target: Optional[float]


class GPUPCILink(BaseModel):
    generation: str
    max_generation: str
    width: str
    max_width: str


class GPUPCI(BaseModel):
    bus: int
    device_id: str
    link: GPUPCILink
    tx: float
    rx: float


class GPU(BaseModel):
    name: str
    brand: str = "NVIDIA"
    product_line: str
    architecture: str
    uuid: str
    pci: GPUPCI
    fan_speed: Optional[str]
    performance_state: str
    memory: GPUMemory
    compute_mode: str
    utilisation: float
    encoder: GPUEncoder
    decoder: GPUDencoder
    temperature: float
    temperature_thresholds: GPUTemperatureThresholds
    power: float
    power_state: str
    power_limits: GPUPowerLimits
    clocks: GPUClocks
    voltage: Optional[str]
