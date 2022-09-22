/** @format */

import React, { useCallback, useMemo } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { deleteMetric } from '../../../store/slices/metrics/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { DeleteModalPropsType } from '../types';

export const DeleteModal: React.FunctionComponent<DeleteModalPropsType> = ({ metricId, close }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const metrics = useSelector((state) => state.metrics.metrics);

  const metric = useMemo(
    () => (metricId != null ? metrics?.[metricId] : null),
    [metrics, metricId]
  );

  const _delete = useCallback(() => {
    if (access_token && metricId != null)
      dispatch(deleteMetric({ id: metricId, access_token })).then((action) => {
        if (action.type === deleteMetric.fulfilled.type) close?.();
      });
  }, [dispatch, metricId]);

  return (
    <Modal isOpen={metricId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>
          Are you sure you want to delete the '{metric?.name || metricId}' metric?
        </ModalTitleElement>
        <ModalActionsElement>
          <Button onClick={_delete}>Delete</Button>
          <Button negative onClick={close}>
            Cancel
          </Button>
        </ModalActionsElement>
      </ModalContentElement>
    </Modal>
  );
};
