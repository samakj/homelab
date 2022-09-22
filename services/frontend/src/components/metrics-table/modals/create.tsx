/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { createMetric, updateMetric } from '../../../store/slices/metrics/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { CreateModalPropsType } from '../types';
import { Input } from '../../input';
import { CreateModalBodyElement, ErrorElement } from '../elements';

export const CreateModal: React.FunctionComponent<CreateModalPropsType> = ({ close, isOpen }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const [localName, setLocalName] = useState('');
  const [localAbbreviation, setLocalAbbreviation] = useState('');
  const [localUnit, setLocalUnit] = useState('');

  const canSave = useMemo(() => localName && localAbbreviation, [localName, localAbbreviation]);
  const createError = useSelector((state) => state.metrics.requests.createMetric.error);

  const save = useCallback(() => {
    if (access_token)
      dispatch(
        createMetric({
          access_token,
          metric: {
            name: localName,
            abbreviation: localAbbreviation,
            unit: localUnit || undefined,
          },
        })
      ).then((action) => {
        if (action.type === updateMetric.fulfilled.type) close?.();
      });
  }, [dispatch, access_token, localName, localAbbreviation, localUnit]);

  const _close = useCallback(() => {
    setLocalName('');
    setLocalAbbreviation('');
    setLocalUnit('');
    close?.();
  }, [setLocalName, setLocalAbbreviation, setLocalUnit, close]);

  return (
    <Modal isOpen={isOpen} close={_close}>
      <ModalContentElement>
        <ModalTitleElement>Create Metric</ModalTitleElement>
        <CreateModalBodyElement>
          {createError && (
            <ErrorElement>
              {createError?.json?.detail || createError?.message || 'Unknown Error'}
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
            label="Name"
            value={localAbbreviation}
            onChange={(event) => setLocalAbbreviation(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="text"
            label="Name"
            value={localUnit}
            onChange={(event) => setLocalUnit(event.currentTarget.value.toLowerCase())}
          />
        </CreateModalBodyElement>
        <ModalActionsElement>
          <Button onClick={save} disabled={!canSave}>
            Save
          </Button>
          <Button negative onClick={_close}>
            Cancel
          </Button>
        </ModalActionsElement>
      </ModalContentElement>
    </Modal>
  );
};
