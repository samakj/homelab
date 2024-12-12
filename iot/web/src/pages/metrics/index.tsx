/** @format */
import { useEffect } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { Main, PageGrid } from '@/components/page-structure';
import { CreateGridCard, GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, THead, TR, Table } from '@/components/table';
import { routes } from '@/router/routes';
import { useGetMetrics, useMetrics } from '@/store/slices/metrics/hooks';

import { MetricsPagePropsType } from './types';

const Metrics: React.FunctionComponent<MetricsPagePropsType> = ({}) => {
  const { getMetrics } = useGetMetrics();
  const metrics = useMetrics();

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  return (
    <Main>
      <PageGrid>
        <GridCard colSpan={5} rowSpan={5}>
          <Table>
            <THead>
              <TR>
                <TH center>ID</TH>
                <TH left>Name</TH>
                <TH left>Abbreviation</TH>
                <TH center>Unit</TH>
              </TR>
            </THead>
            <TBody>
              {Object.values(metrics).map((metric) => (
                <TR key={metric.id}>
                  <TD center>
                    <Link to={generatePath(routes.metric.path, metric)}>{metric.id}</Link>
                  </TD>
                  <TD left>{metric.name}</TD>
                  <TD left>{metric.abbreviation}</TD>
                  <TD center>{metric.unit}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GridCard>
        <CreateGridCard to={generatePath(routes.metric.path, { id: 'create' })} />
      </PageGrid>
    </Main>
  );
};

export default Metrics;
