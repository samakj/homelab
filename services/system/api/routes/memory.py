from fastapi import Request

from models.memory import Memory

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.memory import MemoryStore


MEMORY_V0_ROUTER = APIRouter(prefix="/v0/memory", tags=["memory"])


@MEMORY_V0_ROUTER.get("/", response_model=Memory)
async def get_memory(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.memory.get")),
) -> Memory:
    memory_store: MemoryStore = request.app.memory_store
    return memory_store.get_memory()
