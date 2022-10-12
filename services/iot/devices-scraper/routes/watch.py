from pydantic import BaseModel
from typing import Optional
from fastapi import Query, Depends, WebSocket, Request

from shared.python.extensions.speedyapi import APIRouter
from shared.python.models.authorisation import PermissionCredentials
from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.websocket import WebsocketMeta
from shared.python.extensions.speedyapi.websockets import Websockets

WATCH_V0_ROUTER = APIRouter(prefix="/v0/watch", tags=["watch"])


class WatchlistResponse(BaseModel):
    measurements: dict[str, WebsocketMeta]
    logs: dict[str, WebsocketMeta]


@WATCH_V0_ROUTER.get("/", response_model=dict[str, dict[str, WebsocketMeta]])
async def get_watchlist(
    request: Request,
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.watch")
    ),
) -> WebsocketMeta:
    return WatchlistResponse(
        measurements={
            deviceId: websocket.meta
            for deviceId, websocket in request.app.measurements_scraper.websockets.items()
        },
        logs={},
    )


@WATCH_V0_ROUTER.post("/{device_id:int}/measurements", response_model=WebsocketMeta)
async def watch_device_measurements(
    device_id: int,
    request: Request,
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.watch")
    ),
) -> WebsocketMeta:
    return await request.app.measurements_scraper.watch(device_id=device_id)


@WATCH_V0_ROUTER.delete("/{device_id:int}/measurements", response_model=WebsocketMeta)
async def unwatch_device_measurements(
    device_id: int,
    request: Request,
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.watch")
    ),
) -> WebsocketMeta:
    return await request.app.measurements_scraper.unwatch(device_id=device_id)


@WATCH_V0_ROUTER.websocket("/ws")
async def watchlist_websocket(
    websocket: WebSocket,
    scope: Optional[str] = Query(default="devices"),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="devices")),
    websockets: Websockets = Depends(Websockets),
) -> None:
    connection = await websockets.add_websocket(
        scope="devices", session=permissions.session
    )
    await connection.listen()
