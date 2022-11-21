# from fastapi import Depends
from cpuinfo import get_cpu_info

from cache import cache
from models.cpu import CPU, CPUCache

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter


CPU_V0_ROUTER = APIRouter(prefix="/v0/cpu", tags=["cpu"])


@CPU_V0_ROUTER.get("/", response_model=CPU)
@cache.route(expiry=60)
async def get_cpu(
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.cpu.get")),
) -> CPU:
    raw = get_cpu_info()

    return CPU(
        vendor=raw.get("vendor_id_raw", ""),
        hardware=raw.get("hardware_raw", ""),
        name=raw.get("brand_raw", ""),
        architecture=raw["arch"],
        bits=raw["bits"],
        frequency=raw["hz_actual"][0],
        cores=raw["count"],
        cache=CPUCache(
            l1=raw["l1_data_cache_size"],
            l2=raw["l2_cache_size"],
            l3=raw["l3_cache_size"],
        ),
    )
