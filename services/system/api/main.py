from cache import cache
from config import config
from routes.cpu import CPU_V0_ROUTER
from routes.gpu import GPU_V0_ROUTER
from routes.network import NETWORK_V0_ROUTER
from routes.disk import DISK_V0_ROUTER
from routes.memory import MEMORY_V0_ROUTER
from shared.python.extensions.speedyapi import SpeedyAPI
from stores.cpu import CPUStore
from stores.gpu import GPUStore
from stores.network import NetworkStore
from stores.disk import DiskStore
from stores.memory import MemoryStore

app = SpeedyAPI()
app.config = config

app.cache = cache

app.include_router(CPU_V0_ROUTER)
app.include_router(GPU_V0_ROUTER)
app.include_router(NETWORK_V0_ROUTER)
app.include_router(MEMORY_V0_ROUTER)
app.include_router(DISK_V0_ROUTER)

app.cpu_store = CPUStore()
app.gpu_store = GPUStore()
app.network_store = NetworkStore()
app.memory_store = MemoryStore()
app.disk_store = DiskStore()


@app.on_event("startup")  # type: ignore
async def startup() -> None:
    app.cache.logger = app.logger
    await app.cache.initialise()

    await app.cpu_store.initialise()
    await app.gpu_store.initialise()
    await app.network_store.initialise()
    await app.disk_store.initialise()
    await app.memory_store.initialise()
