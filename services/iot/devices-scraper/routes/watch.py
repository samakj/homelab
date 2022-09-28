from typing import Optional
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from shared.python.models.authorisation import PermissionCredentials
from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.websocket import WebsocketMeta

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
        measurements=request.app.measurements_scraper.websockets, logs={}
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
