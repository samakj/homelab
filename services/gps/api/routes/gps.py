from datetime import datetime
from typing import Any, Dict, Optional
from fastapi import Query, Request, APIRouter, Response

from gps_watcher import Position, Device, Satellite

GPS_V0_ROUTER = APIRouter(prefix="/v0", tags=["GPS"])


@GPS_V0_ROUTER.get("/raw", response_model=Dict[str, Any])
async def get_state(request: Request) -> Dict[str, Any]:
    return request.app.watcher.state


@GPS_V0_ROUTER.get("/position", response_model=Position)
async def get_position(request: Request) -> Position:
    return request.app.watcher.position


@GPS_V0_ROUTER.get("/device", response_model=Device)
async def get_device(request: Request) -> Device:
    return request.app.watcher.device


@GPS_V0_ROUTER.get("/time", response_model=datetime)
async def get_time(request: Request) -> datetime:
    return Response(content=request.app.watcher.time.isoformat(), status_code=200)


@GPS_V0_ROUTER.get("/satellites", response_model=list[Satellite])
async def get_satellites(
    request: Request,
    used: Optional[bool] = Query(
        default=None,
        description="Whether the satellite is being used to inform GPS or not.",
    ),
) -> list[Satellite]:
    if used is None:
        return request.app.watcher.satellites
    return [
        satellite
        for satellite in request.app.watcher.satellites
        if satellite.used == used
    ]
