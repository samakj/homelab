from fastapi import Request

from models.cpu import CPU

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.cpu import CPUStore


CPU_V0_ROUTER = APIRouter(prefix="/v0/cpu", tags=["cpu"])


@CPU_V0_ROUTER.get("/", response_model=CPU)
async def get_cpu(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.cpu.get")),
) -> CPU:
    cpu_store: CPUStore = request.app.cpu_store
    return cpu_store.get_cpu()
