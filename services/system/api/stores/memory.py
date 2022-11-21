import asyncio
from asyncio import Task
from typing import Any
from psutil import virtual_memory


from models.memory import Memory


class MemoryStore:
    memory: Memory
    task: Task[Any]

    def __init__(self) -> None:
        self.memory = self._get_memory()

    def _get_memory(self) -> Memory:
        raw = virtual_memory()
        return Memory(
            total=raw.total,
            available=raw.available,
            utilisation=raw.percent / 100,
            used=raw.used,
            free=raw.free,
            active=raw.active,
            inactive=raw.inactive,
            buffers=raw.buffers,
            cached=raw.cached,
            shared=raw.shared,
            slab=raw.slab,
        )

    def get_memory(self) -> Memory:
        return self.memory

    async def memory_poller(self) -> None:
        while True:
            self.memory = self._get_memory()

            await asyncio.sleep(1)

    async def initialise(self) -> None:
        self.task = asyncio.create_task(self.memory_poller())
