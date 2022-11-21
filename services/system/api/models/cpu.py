from pydantic import BaseModel
from enum import Enum


class CPUArchitectures(Enum):
    ARM_7 = "ARM_7"
    ARM_8 = "ARM_8"
    LOONG_32 = "LOONG_32"
    LOONG_64 = "LOONG_64"
    MIPS_32 = "MIPS_32"
    MIPS_64 = "MIPS_64"
    PPC_32 = "PPC_32"
    PPC_64 = "PPC_64"
    RISCV_32 = "RISCV_32"
    RISCV_64 = "RISCV_64"
    SPARC_32 = "SPARC_32"
    SPARC_64 = "SPARC_64"
    S390X = "S390X"
    X86_32 = "X86_32"
    X86_64 = "X86_64"


class CPUCache(BaseModel):
    l1: int
    l2: int
    l3: int


class CPU(BaseModel):
    vendor: str
    hardware: str
    name: str
    architecture: CPUArchitectures
    bits: int
    frequency: int
    cores: int
    cache: CPUCache
