from fastapi import Request
from models.gpu import GPU

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.gpu import GPUStore


GPU_V0_ROUTER = APIRouter(prefix="/v0/gpu", tags=["gpu"])


@GPU_V0_ROUTER.get("/", response_model=list[GPU])
async def get_gpus(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.gpu.get")),
) -> list[GPU]:
    gpu_store: GPUStore = request.app.gpu_store
    return gpu_store.get_gpus()
