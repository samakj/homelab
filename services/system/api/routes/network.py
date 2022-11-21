from fastapi import Request

from models.network import Network

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.network import NetworkStore


NETWORK_V0_ROUTER = APIRouter(prefix="/v0/network", tags=["network"])


@NETWORK_V0_ROUTER.get("/", response_model=list[Network])
async def get_network(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.network.get")),
) -> list[Network]:
    network_store: NetworkStore = request.app.network_store
    return network_store.get_networks()
