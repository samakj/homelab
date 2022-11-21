import asyncio
from asyncio import Task
from typing import Any, Optional
from psutil import disk_io_counters, disk_partitions, disk_usage


from models.disk import (
    Disk,
    DiskSpace,
    DiskOperations,
    DiskBytes,
    DiskTimes,
    DiskRates,
)


class DiskStore:
    disks: dict[str, Disk]
    task: Task[Any]

    def __init__(self) -> None:
        self.disks = None  # type: ignore
        self.disks = self._get_disks()

    def _get_disks(self) -> dict[str, Disk]:
        partitions = {partition.device.split("/")[-1]: partition for partition in disk_partitions()}
        counters = disk_io_counters(perdisk=True)
        disks: dict[str, Disk] = {}

        for name in {*partitions.keys(), *counters.keys()}:
            if "loop" in name:
                continue

            partition = partitions.get(name)
            previous: Optional[Disk] = self.disks.get(name) if self.disks is not None else None
            usage = disk_usage(partition.mountpoint) if partition is not None else None
            counter = counters.get(name)

            disks[name] = Disk(
                name=name,
                device=partition.device if partition is not None else None,
                path=partition.mountpoint if partition is not None else None,
                filesystem=partition.fstype if partition is not None else None,
                options=partition.opts if partition is not None else None,
                maxfile=partition.maxfile if partition is not None else None,
                maxpath=partition.maxpath if partition is not None else None,
                utilisation=usage.percent / 100 if usage is not None else None,
                space=DiskSpace(
                    total=usage.total,
                    used=usage.used,
                    free=usage.free,
                )
                if usage is not None
                else None,
                operations=DiskOperations(read=counter.read_count, write=counter.write_count)
                if counter is not None
                else None,
                bytes=DiskBytes(read=counter.read_bytes, write=counter.write_bytes)
                if counter is not None
                else None,
                times=DiskTimes(read=counter.read_time, write=counter.write_time)
                if counter is not None
                else None,
                rates=DiskRates(
                    read=counter.read_bytes - previous.bytes.read,
                    write=counter.write_bytes - previous.bytes.write,
                )
                if previous is not None and counter is not None
                else None,
            )

        return disks

    def get_disks(self) -> list[Disk]:
        return list(self.disks.values())

    async def disk_poller(self) -> None:
        while True:
            self.disks = self._get_disks()

            await asyncio.sleep(1)

    async def initialise(self) -> None:
        self.task = asyncio.create_task(self.disk_poller())
