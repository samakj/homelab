from datetime import datetime
from typing import Any, Callable, Optional
from fastapi import APIRouter, HTTPException, Query, Depends, WebSocket, Request

from cache import cache
from stores.devices import DevicesStore
from shared.python.extensions.speedyapi.cache import Cache
from shared.python.models.authorisation import PermissionCredentials
from shared.python.models.device import Device, CreateDevice
from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi.websockets import Websockets


DEVICES_V0_ROUTER = APIRouter(prefix="/v0/devices", tags=["devices"])


def cache_response_contains_id_generator(id: int) -> Callable[..., bool]:
    def condition(response: Any) -> bool:
        if isinstance(response, list):
            for item in response:
                if condition(item):
                    return True
        if isinstance(response, dict):
            if response.get("id") == id:
                return True
            for item in response.values():
                if condition(item):
                    return True
        return False

    return condition


@DEVICES_V0_ROUTER.get("/{id:int}", response_model=Device)
@cache.route(expiry=60)
async def get_device(
    id: int,
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="devices.get")),
) -> Device:
    device = await devices_store.get_device(id=id)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    return device


@DEVICES_V0_ROUTER.get("/{mac_or_ip:str}", response_model=Device)
@cache.route(expiry=60)
async def get_device_by_mac_or_ip(
    mac_or_ip: str,
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="devices.get")),
) -> Device:
    device = await devices_store.get_device_by_mac(mac=mac_or_ip)

    if device is None:
        device = await devices_store.get_device_by_ip(ip=mac_or_ip)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    return device


@DEVICES_V0_ROUTER.get("/", response_model=list[Device])
@cache.route(expiry=60)
async def get_devices(
    id: Optional[list[int]] = Query(default=None),
    mac: Optional[list[str]] = Query(default=None),
    ip: Optional[list[str]] = Query(default=None),
    location_id: Optional[datetime] = Query(default=None),
    last_message_gte: Optional[datetime] = Query(default=None),
    last_message_lte: Optional[datetime] = Query(default=None),
    last_message_null: Optional[bool] = Query(default=None),
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="devices.get")),
) -> Device:
    device = await devices_store.get_devices(
        id=id,
        mac=mac,
        ip=ip,
        location_id=location_id,
        last_message_gte=last_message_gte,
        last_message_lte=last_message_lte,
        last_message_null=last_message_null,
    )

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    return device


@DEVICES_V0_ROUTER.post("/", response_model=Device)
async def create_device(
    device: CreateDevice,
    request: Request,
    devices_store: DevicesStore = Depends(DevicesStore),
    cache: Cache = Depends(cache),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.create")
    ),
) -> Device:
    device = await devices_store.create_device(device=device)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    await cache.clear_pattern(
        pattern=cache.create_route_key(request=request, include_query_params=False)
        + "*"
    )

    return device


@DEVICES_V0_ROUTER.patch("/{id:int}", response_model=Device)
async def update_device(
    id: int,
    device: Device,
    request: Request,
    devices_store: DevicesStore = Depends(DevicesStore),
    cache: Cache = Depends(cache),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.update")
    ),
) -> Device:
    device = await devices_store.update_device(device=device)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    await cache.clear_pattern(
        pattern=cache.create_route_key(request=request, include_query_params=False)
        + "*"
    )

    return device


@DEVICES_V0_ROUTER.delete("/{id:int}")
async def delete_device(
    id: int,
    request: Request,
    devices_store: DevicesStore = Depends(DevicesStore),
    cache: Cache = Depends(cache),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.delete")
    ),
) -> Device:
    await devices_store.delete_device(id=id)

    await cache.clear_pattern(
        pattern=cache.create_route_key(request=request, include_query_params=False)
        + "*"
    )

    return None


@DEVICES_V0_ROUTER.websocket("/ws")
async def devices_websocket(
    websocket: WebSocket,
    scope: Optional[str] = Query(default="devices"),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="devices")),
    websockets: Websockets = Depends(Websockets),
) -> None:
    connection = await websockets.add_websocket(
        scope="devices", session=permissions.session
    )
    await connection.listen()
