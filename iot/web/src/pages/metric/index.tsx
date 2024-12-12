/** @format */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { isIntegerString } from '@/common/numbers';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Main, PageGrid } from '@/components/page-structure';
import { GridCard } from '@/components/page-structure/cards';
import { TBody, TD, TH, TR, Table } from '@/components/table';
import { MetricType } from '@/models/metric';
import { routes } from '@/router/routes';
import {
  useCreateMetric,
  useDeleteMetric,
  useGetMetric,
  useMetric,
  useUpdateMetric,
} from '@/store/slices/metrics/hooks';
import { createMetricThunk, deleteMetricThunk } from '@/store/slices/metrics/thunks';

import { MetricPagePropsType } from './types';

const Metric: React.FunctionComponent<MetricPagePropsType> = ({}) => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => (_id && isIntegerString(_id) ? parseInt(_id) : undefined), [_id]);
  const isCreate = useMemo(() => _id === 'create', [_id]);
  const { getMetric } = useGetMetric();
  const { updateMetric } = useUpdateMetric();
  const { createMetric } = useCreateMetric();
  const { deleteMetric } = useDeleteMetric();
  const metric = useMetric(id);

  const [localMetric, setLocalMetric] = useState<Partial<MetricType>>(metric || {});

  useEffect(() => {
    if (!id && !isCreate) navigate(routes.metrics.path);
  }, [navigate, id, isCreate]);

  useEffect(() => {
    if (id) getMetric({ id });
  }, [getMetric, id]);

  useEffect(() => {
    if (metric) setLocalMetric(metric);
  }, [metric]);

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMetric({ ...(localMetric || {}), name: event.currentTarget.value });
    },
    [localMetric]
  );

  const onAbbreviationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMetric({ ...(localMetric || {}), abbreviation: event.currentTarget.value });
    },
    [localMetric]
  );

  const onUnitChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalMetric({ ...(localMetric || {}), unit: event.currentTarget.value || undefined });
    },
    [localMetric]
  );

  const save = useCallback(() => {
    const { id, name, abbreviation, unit } = localMetric;
    if (name && abbreviation) {
      if (isCreate)
        createMetric({
          name,
          abbreviation,
          unit,
        }).then((action) => {
          if (createMetricThunk.fulfilled.match(action)) {
            navigate(generatePath(routes.metric.path, action.payload.data.id));
          }
        });
      else if (id)
        updateMetric({
          id,
          name,
          abbreviation,
          unit,
        });
    }
  }, [localMetric, updateMetric, createMetric, isCreate, navigate]);

  const del = useCallback(() => {
    const { id } = localMetric;
    if (id) {
      deleteMetric({ id }).then((action) => {
        if (deleteMetricThunk.fulfilled.match(action)) {
          navigate(routes.metrics.path);
        }
      });
    }
  }, [deleteMetric, localMetric, navigate]);

  return (
    <Main>
      <PageGrid>
        <GridCard rowSpan={5} colSpan={3}>
          <Table>
            <TBody>
              <TR>
                <TH left>ID</TH>
                <TD right>{metric?.id || '-'}</TD>
              </TR>
              <TR>
                <TH left>Name</TH>
                <TD right>
                  <Input value={localMetric?.name} onChange={onNameChange} />
                </TD>
              </TR>
              <TR>
                <TH left>Abbreviation</TH>
                <TD right>
                  <Input value={localMetric?.abbreviation} onChange={onAbbreviationChange} />
                </TD>
              </TR>
              <TR>
                <TH left>Unit</TH>
                <TD right>
                  <Input value={localMetric?.unit} onChange={onUnitChange} />
                </TD>
              </TR>
            </TBody>
          </Table>
          <Button
            onClick={save}
            disabled={
              !(localMetric?.id || isCreate) || !localMetric?.name || !localMetric?.abbreviation
            }
          >
            Save
          </Button>
          <Button onClick={del} disabled={!localMetric?.id}>
            Delete
          </Button>
        </GridCard>
      </PageGrid>
    </Main>
  );
};

export default Metric;
