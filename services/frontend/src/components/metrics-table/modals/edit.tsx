/** @format */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { updateMetric } from '../../../store/slices/metrics/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { EditModalPropsType } from '../types';
import { Input } from '../../input';
import { EditModalBodyElement, ErrorElement } from '../elements';

export const EditModal: React.FunctionComponent<EditModalPropsType> = ({ metricId, close }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const metrics = useSelector((state) => state.metrics.metrics);
  const updateError = useSelector((state) => state.metrics.requests.updateMetric.error);

  const metric = useMemo(
    () => (metricId != null ? metrics?.[metricId] : null),
    [metrics, metricId]
  );

  const [localName, setLocalName] = useState(metric?.name || '');
  const [localAbbreviation, setLocalAbbreviation] = useState(metric?.abbreviation || '');
  const [localUnit, setLocalUnit] = useState(metric?.unit || '');

  useEffect(() => {
    if (metric) {
      setLocalName(metric.name);
      setLocalAbbreviation(metric?.abbreviation);
      setLocalUnit(metric?.unit);
    }
  }, [metric, setLocalName, setLocalAbbreviation, setLocalUnit]);

  const canSave = useMemo(() => localName && localAbbreviation, [localName, localAbbreviation]);

  const save = useCallback(() => {
    if (access_token && metricId != null)
      dispatch(
        updateMetric({
          access_token,
          metric: {
            id: metricId,
            name: localName,
            abbreviation: localAbbreviation,
            unit: localUnit || undefined,
          },
        })
      ).then((action) => {
        if (action.type === updateMetric.fulfilled.type) close?.();
      });
  }, [dispatch, metricId, access_token, localName, localAbbreviation, localUnit]);

  return (
    <Modal isOpen={metricId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>Update metric '{metric?.name || metricId}'</ModalTitleElement>
        <EditModalBodyElement>
          {updateError && (
            <ErrorElement>
              {updateError?.json?.detail
                ? JSON.stringify(updateError.json.detail)
                : updateError?.message || 'Unknown Error'}
            </ErrorElement>
          )}
          <Input
            type="text"
            label="Name"
            value={localName}
            onChange={(event) => setLocalName(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="text"
            label="Abbreviation"
            value={localAbbreviation}
            onChange={(event) => setLocalAbbreviation(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="text"
            label="Unit"
            value={localUnit}
            onChange={(event) => setLocalUnit(event.currentTarget.value.toLowerCase())}
          />
        </EditModalBodyElement>
        <ModalActionsElement>
          <Button onClick={save} disabled={!canSave}>
            Save
          </Button>
          <Button negative onClick={close}>
            Cancel
          </Button>
        </ModalActionsElement>
      </ModalContentElement>
    </Modal>
  );
};
