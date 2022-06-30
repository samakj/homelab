from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from stores.locations import LocationsStore
from shared.python.models.authorisation import PermissionCredentials
from shared.python.models.location import Location, CreateLocation
from shared.python.helpers.bearer_permission import BearerPermission


LOCATIONS_V0_ROUTER = APIRouter(prefix="/v0/locations", tags=["locations"])


@LOCATIONS_V0_ROUTER.get("/{id:int}", response_model=Location)
async def get_location(
    id: int,
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.get")
    ),
) -> Location:
    location = await locations_store.get_location(id=id)

    if location is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    return location


@LOCATIONS_V0_ROUTER.get("/{name:str}", response_model=Location)
async def get_location_by_name(
    name: str,
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.get")
    ),
) -> Location:
    location = await locations_store.get_location_by_name(name=name)

    if location is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    return location


@LOCATIONS_V0_ROUTER.get("/", response_model=list[Location])
async def get_locations(
    id: Optional[list[int]] = Query(None),
    name: Optional[list[str]] = Query(None),
    tags: Optional[list[str]] = Query(None),
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.get")
    ),
) -> Location:
    location = await locations_store.get_locations(id=id, name=name, tags=tags)

    if location is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    return location


@LOCATIONS_V0_ROUTER.post("/", response_model=Location)
async def create_location(
    location: CreateLocation,
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.create")
    ),
) -> Location:
    location = await locations_store.create_location(location=location)

    if location is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    return location


@LOCATIONS_V0_ROUTER.patch("/{id:int}", response_model=Location)
async def update_location(
    id: int,
    location: Location,
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.update")
    ),
) -> Location:
    location = await locations_store.update_location(location=location)

    if location is None:
        raise HTTPException(status_code=404, detail="Location not found.")

    return location


@LOCATIONS_V0_ROUTER.delete("/{id:int}")
async def delete_location(
    id: int,
    locations_store: LocationsStore = Depends(LocationsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="locations.delete")
    ),
) -> Location:
    await locations_store.delete_location(id=id)
    return None
