from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends, WebSocket

from stores.measurements import MeasurementsStore
from shared.python.models.authorisation import PermissionCredentials
from shared.python.models.measurement import Measurement, CreateMeasurement, ValueType
from shared.python.helpers.bearer_permission import BearerPermission
from shared.python.extensions.speedyapi.websockets import Websockets


MEASUREMENTS_V0_ROUTER = APIRouter(prefix="/v0/measurements", tags=["measurements"])


@MEASUREMENTS_V0_ROUTER.get("/{id:int}", response_model=Measurement)
async def get_measurement(
    id: int,
    measurements_store: MeasurementsStore = Depends(MeasurementsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="measurements.get")
    ),
) -> Measurement:
    measurement = await measurements_store.get_measurement(id=id)

    if measurement is None:
        raise HTTPException(status_code=404, detail="Measurement not found.")

    return measurement


@MEASUREMENTS_V0_ROUTER.get("/", response_model=list[Measurement])
async def get_measurements(
    id: Optional[list[int]] = Query(default=None),
    device_id: Optional[list[int]] = Query(default=None),
    metric_id: Optional[list[int]] = Query(default=None),
    location_id: Optional[list[int]] = Query(default=None),
    tags: Optional[list[str]] = Query(default=None),
    timestamp_gte: Optional[datetime] = Query(default=None),
    timestamp_lte: Optional[datetime] = Query(default=None),
    value: Optional[ValueType] = Query(default=None),
    value_gte: Optional[ValueType] = Query(default=None),
    value_lte: Optional[ValueType] = Query(default=None),
    measurements_store: MeasurementsStore = Depends(MeasurementsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="measurements.get")
    ),
) -> Measurement:
    measurement = await measurements_store.get_measurements(
        id=id,
        device_id=device_id,
        metric_id=metric_id,
        location_id=location_id,
        tags=tags,
        timestamp_gte=timestamp_gte,
        timestamp_lte=timestamp_lte,
        value=value,
        value_gte=value_gte,
        value_lte=value_lte,
    )

    if measurement is None:
        raise HTTPException(status_code=404, detail="Measurement not found.")


@MEASUREMENTS_V0_ROUTER.get("/latest", response_model=list[Measurement])
async def get_latest_measurements(
    id: Optional[list[int]] = Query(default=None),
    device_id: Optional[list[int]] = Query(default=None),
    metric_id: Optional[list[int]] = Query(default=None),
    location_id: Optional[list[int]] = Query(default=None),
    tags: Optional[list[str]] = Query(default=None),
    measurements_store: MeasurementsStore = Depends(MeasurementsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="measurements.get")
    ),
) -> Measurement:
    measurement = await measurements_store.get_latest_measurements(
        id=id,
        device_id=device_id,
        metric_id=metric_id,
        location_id=location_id,
        tags=tags,
    )

    if measurement is None:
        raise HTTPException(status_code=404, detail="Measurement not found.")

    return measurement


@MEASUREMENTS_V0_ROUTER.post("/", response_model=Measurement)
async def create_measurement(
    measurement: CreateMeasurement,
    measurements_store: MeasurementsStore = Depends(MeasurementsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="measurements.create")
    ),
) -> Measurement:
    measurement = await measurements_store.create_measurement(measurement=measurement)

    if measurement is None:
        raise HTTPException(status_code=404, detail="Measurement not found.")

    return measurement


@MEASUREMENTS_V0_ROUTER.websocket("/ws")
async def measurements_websocket(
    websocket: WebSocket,
    scope: Optional[str] = Query(default="measurements"),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="measurements")
    ),
    websockets: Websockets = Depends(Websockets),
) -> None:
    connection = await websockets.add_websocket(
        scope="measurements", session=permissions.session
    )
    await connection.listen()
