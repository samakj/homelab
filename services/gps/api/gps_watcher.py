import asyncio
from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, Optional

from pydantic import BaseModel

from gpsd import gps, WATCH_ENABLE, WATCH_NEWSTYLE


class Position(BaseModel):
    latitude: Decimal
    longitude: Decimal
    altitude: Decimal


class Device(BaseModel):
    path: str
    driver: str
    subtype: str
    activated: datetime
    baudrate: int


class Satellite(BaseModel):
    PRN: int
    elevation: int
    azimuth: int
    strength: int
    used: bool


class GPSWatcher:
    state: Dict[str, Any]
    host: str
    port: int
    gps: Optional[gps] = None
    position: Optional[Position] = None
    device: Optional[Device] = None
    time: Optional[datetime] = None
    satellites: Optional[list[Satellite]] = None

    def __init__(self, host: str = "127.0.0.1", port: int = 2947) -> None:
        self.state = {}
        self.host = host
        self.port = port

    def update_position(self, data: Dict[str, Any]) -> None:
        if data["class"] == "GST":
            return
        if data.get("lat") is None or data.get("lon") is None:
            return
        if not self.position:
            self.position = Position(latitude=0, longitude=0, altitude=0)

        self.position.latitude = round(data["lat"], 5)
        self.position.longitude = round(data["lon"], 5)

        if data.get("alt") is not None or data.get("altMSL") is not None:
            self.position.altitude = data.get("alt", data["altMSL"])

    def update_device(self, data: Dict[str, Any]) -> None:
        if isinstance(data.get("devices"), list):
            self.device = Device(
                path=data["devices"][0]["path"],
                driver=data["devices"][0]["driver"],
                subtype=data["devices"][0]["subtype"],
                activated=datetime.fromisoformat(
                    data["devices"][0]["activated"].replace("Z", "")
                ),
                baudrate=data["devices"][0]["bps"],
            )

    def update_time(self, data: Dict[str, Any]) -> None:
        if data.get("time") is not None:
            self.time = datetime.fromisoformat(data["time"].replace("Z", ""))

    def update_satellites(self, data: Dict[str, Any]) -> None:
        if data.get("satellites") is not None:
            self.satellites = [
                Satellite(
                    PRN=satellite["PRN"],
                    elevation=satellite["el"],
                    azimuth=satellite["az"],
                    strength=satellite["ss"],
                    used=satellite["used"],
                )
                for satellite in data["satellites"]
            ]

    async def watch(self) -> None:
        if self.gps is None:
            self.gps = gps(host=self.host, port=self.port)

        self.gps.stream(flags=WATCH_ENABLE | WATCH_NEWSTYLE)

        while True:
            data = dict(self.gps.next())

            self.update_position(data)
            self.update_device(data)
            self.update_time(data)
            self.update_satellites(data)

            self.state = {**self.state, **data}
            await asyncio.sleep(0.1)
