from fastapi import Request

from models.disk import Disk

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.disk import DiskStore


DISK_V0_ROUTER = APIRouter(prefix="/v0/disk", tags=["disk"])


@DISK_V0_ROUTER.get("/", response_model=list[Disk])
async def get_disk(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.disk.get")),
) -> list[Disk]:
    disk_store: DiskStore = request.app.disk_store
    return disk_store.get_disks()
