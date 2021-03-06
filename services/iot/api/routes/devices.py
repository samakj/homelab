from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from stores.devices import DevicesStore
from shared.python.models.authorisation import PermissionCredentials
from shared.python.models.device import Device, CreateDevice
from shared.python.helpers.bearer_permission import BearerPermission


DEVICES_V0_ROUTER = APIRouter(prefix="/v0/devices", tags=["devices"])


@DEVICES_V0_ROUTER.get("/{id:int}", response_model=Device)
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
async def get_devices(
    id: Optional[list[int]] = Query(None),
    mac: Optional[list[str]] = Query(None),
    ip: Optional[list[str]] = Query(None),
    location_id: Optional[datetime] = Query(None),
    last_message_gte: Optional[datetime] = Query(None),
    last_message_lte: Optional[datetime] = Query(None),
    last_message_null: Optional[bool] = Query(None),
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
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.create")
    ),
) -> Device:
    device = await devices_store.create_device(device=device)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    return device


@DEVICES_V0_ROUTER.patch("/{id:int}", response_model=Device)
async def update_device(
    id: int,
    device: Device,
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.update")
    ),
) -> Device:
    device = await devices_store.update_device(device=device)

    if device is None:
        raise HTTPException(status_code=404, detail="Device not found.")

    return device


@DEVICES_V0_ROUTER.delete("/{id:int}")
async def delete_device(
    id: int,
    devices_store: DevicesStore = Depends(DevicesStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="devices.delete")
    ),
) -> Device:
    await devices_store.delete_device(id=id)
    return None
