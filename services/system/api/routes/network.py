from fastapi import Request

from models.network import Network, NetworkCard

# from shared.python.models.authorisation import PermissionCredentials
# from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi import APIRouter
from stores.network import NetworkStore


NETWORK_V0_ROUTER = APIRouter(prefix="/v0/networks", tags=["network"])


@NETWORK_V0_ROUTER.get("/", response_model=list[Network])
async def get_networks(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.network.get")),
) -> list[Network]:
    network_store: NetworkStore = request.app.network_store
    return network_store.get_networks()


NETWORK_CARD_V0_ROUTER = APIRouter(prefix="/v0/network-cards", tags=["network"])


@NETWORK_CARD_V0_ROUTER.get("/", response_model=list[NetworkCard])
async def get_network_cards(
    request: Request,
    # permissions: PermissionCredentials = Depends(BearerPermission(scope="system.network.get")),
) -> list[NetworkCard]:
    network_store: NetworkStore = request.app.network_store
    return await network_store.get_network_cards()
