/** @format */

import React, { useEffect } from 'react';
import { MetricsTable } from '../components/metrics-table';
import { scopesMap } from '../configs/scopes';
import { Authorise, useAuthorisation } from '../routing/authorise';
import { useDispatch, useSelector } from '../store';
import { getMetrics } from '../store/slices/metrics/thunks';

const _Metrics: React.FunctionComponent = () => {
  const { access_token } = useAuthorisation();
  const dispatch = useDispatch();
  const metrics = useSelector((state) => state.metrics.metrics);

  useEffect(() => {
    if (access_token) dispatch(getMetrics({ access_token }));
  }, [access_token]);

  return (
    <>
      <MetricsTable metrics={metrics} />
    </>
  );
};

export const Metrics: React.FunctionComponent = () => (
  <Authorise scopes={[scopesMap.metrics.get]}>
    <_Metrics />
  </Authorise>
);
