from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from stores.metrics import MetricsStore
from shared.python.models.authorisation import PermissionCredentials
from shared.python.models.metric import Metric, CreateMetric
from shared.python.helpers.bearer_permission import BearerPermission


METRICS_V0_ROUTER = APIRouter(prefix="/v0/metrics", tags=["metrics"])


@METRICS_V0_ROUTER.get("/{id:int}", response_model=Metric)
async def get_metric(
    id: int,
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="metrics.get")),
) -> Metric:
    metric = await metrics_store.get_metric(id=id)

    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found.")

    return metric


@METRICS_V0_ROUTER.get("/{name:str}", response_model=Metric)
async def get_metric_by_name(
    name: str,
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="metrics.get")),
) -> Metric:
    metric = await metrics_store.get_metric_by_name(name=name)

    if metric is None:
        metric = await metrics_store.get_metric_by_abbreviation(abbreviation=name)

    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found.")

    return metric


@METRICS_V0_ROUTER.get("/", response_model=list[Metric])
async def get_metrics(
    id: Optional[list[int]] = Query(None),
    name: Optional[list[str]] = Query(None),
    abbreviation: Optional[list[str]] = Query(None),
    unit: Optional[list[str]] = Query(None),
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(BearerPermission(scope="metrics.get")),
) -> Metric:
    metric = await metrics_store.get_metrics(
        id=id, name=name, abbreviation=abbreviation, unit=unit
    )

    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found.")

    return metric


@METRICS_V0_ROUTER.post("/", response_model=Metric)
async def create_metric(
    metric: CreateMetric,
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="metrics.create")
    ),
) -> Metric:
    metric = await metrics_store.create_metric(metric=metric)

    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found.")

    return metric


@METRICS_V0_ROUTER.patch("/{id:int}", response_model=Metric)
async def update_metric(
    id: int,
    metric: Metric,
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="metrics.update")
    ),
) -> Metric:
    metric = await metrics_store.update_metric(metric=metric)

    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found.")

    return metric


@METRICS_V0_ROUTER.delete("/{id:int}")
async def delete_metric(
    id: int,
    metrics_store: MetricsStore = Depends(MetricsStore),
    permissions: PermissionCredentials = Depends(
        BearerPermission(scope="metrics.delete")
    ),
) -> Metric:
    await metrics_store.delete_metric(id=id)
    return None
