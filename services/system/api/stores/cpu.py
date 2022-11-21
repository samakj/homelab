import asyncio
from asyncio import Task
from typing import Any
from cpuinfo import get_cpu_info
from psutil import cpu_percent

from models.cpu import CPU, CPUCache


class CPUStore:
    cpu: CPU
    task: Task[Any]

    def __init__(self) -> None:
        self.cpu = self._get_cpu()

    def _get_cpu(self) -> CPU:
        raw = get_cpu_info()

        return CPU(
            vendor=raw.get("vendor_id_raw", ""),
            hardware=raw.get("hardware_raw", ""),
            name=raw.get("brand_raw", ""),
            architecture=raw["arch"],
            bits=raw["bits"],
            frequency=raw["hz_actual"][0],
            cores=raw["count"],
            utilisation=cpu_percent(interval=1) / 100,
            cache=CPUCache(
                l1=raw["l1_data_cache_size"],
                l2=raw["l2_cache_size"],
                l3=raw["l3_cache_size"],
            ),
        )

    def get_cpu(self) -> CPU:
        return self.cpu

    async def cpu_poller(self) -> None:
        while True:
            self.cpu = self._get_cpu()

            await asyncio.sleep(1)

    async def initialise(self) -> None:
        self.task = asyncio.create_task(self.cpu_poller())
