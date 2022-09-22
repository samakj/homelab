/** @format */

import React, { useMemo, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useTheme } from 'styled-components';
import { scopesMap } from '../../configs/scopes';
import { useAuthorisation } from '../../routing/authorise';
import { MetricType } from '../../store/slices/metrics/types';
import { DeleteModal } from './modals/delete';
import { EditModal } from './modals/edit';
import { CreateModal } from './modals/create';
import {
  IconButtonContainerElement,
  MetricsTableCellElement,
  MetricsTableElement,
  MetricsTableHeaderCellElement,
  MetricsTableNameCellElement,
} from './elements';
import { MetricsTablePropsType } from './types';
import { Button } from '../button';

export const MetricsTable: React.FunctionComponent<MetricsTablePropsType> = ({ metrics }) => {
  const theme = useTheme();
  const { isInScope } = useAuthorisation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [metricToEdit, setMetricToEdit] = useState<number>();
  const [metricToDelete, setMetricToDelete] = useState<number>();

  const canCreate = useMemo(() => isInScope(scopesMap.metrics.create), [isInScope]);
  const canUpdate = useMemo(() => isInScope(scopesMap.metrics.update), [isInScope]);
  const canDelete = useMemo(() => isInScope(scopesMap.metrics.delete), [isInScope]);
  const hasActions = useMemo(() => canUpdate || canDelete, [canUpdate, canDelete]);

  return (
    <>
      <MetricsTableElement>
        <thead>
          <tr>
            <MetricsTableHeaderCellElement>Name</MetricsTableHeaderCellElement>
            <MetricsTableHeaderCellElement>Abbreviation</MetricsTableHeaderCellElement>
            <MetricsTableHeaderCellElement>Unit</MetricsTableHeaderCellElement>
            {hasActions && <MetricsTableHeaderCellElement>Actions</MetricsTableHeaderCellElement>}
          </tr>
        </thead>
        <tbody>
          {Object.values(metrics || {}).map((metric: MetricType) => (
            <tr key={metric.id}>
              <MetricsTableNameCellElement>
                {metric.name.replace('-', ' ')}
              </MetricsTableNameCellElement>
              <MetricsTableCellElement>{metric.abbreviation}</MetricsTableCellElement>
              <MetricsTableCellElement>{metric.unit}</MetricsTableCellElement>
              {hasActions && (
                <MetricsTableCellElement>
                  {canUpdate && (
                    <IconButtonContainerElement onClick={() => setMetricToEdit(metric.id)}>
                      <MdEdit />
                    </IconButtonContainerElement>
                  )}
                  {canDelete && (
                    <IconButtonContainerElement onClick={() => setMetricToDelete(metric.id)}>
                      <MdDelete color={theme.colours.red} />
                    </IconButtonContainerElement>
                  )}
                </MetricsTableCellElement>
              )}
            </tr>
          ))}
          {canCreate && (
            <tr>
              <MetricsTableCellElement colSpan={99}>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create New Metric</Button>
              </MetricsTableCellElement>
            </tr>
          )}
        </tbody>
      </MetricsTableElement>
      {canCreate && (
        <CreateModal isOpen={isCreateModalOpen} close={() => setIsCreateModalOpen(false)} />
      )}
      {canUpdate && <EditModal metricId={metricToEdit} close={() => setMetricToEdit(undefined)} />}
      {canDelete && (
        <DeleteModal metricId={metricToDelete} close={() => setMetricToDelete(undefined)} />
      )}
    </>
  );
};
