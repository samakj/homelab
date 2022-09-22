/** @format */

import React, { useCallback, useMemo } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { deleteDevice } from '../../../store/slices/devices/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { DeleteModalPropsType } from '../types';

export const DeleteModal: React.FunctionComponent<DeleteModalPropsType> = ({ deviceId, close }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const devices = useSelector((state) => state.devices.devices);

  const device = useMemo(
    () => (deviceId != null ? devices?.[deviceId] : null),
    [devices, deviceId]
  );

  const _delete = useCallback(() => {
    if (access_token && deviceId != null)
      dispatch(deleteDevice({ id: deviceId, access_token })).then((action) => {
        if (action.type === deleteDevice.fulfilled.type) close?.();
      });
  }, [dispatch, deviceId]);

  return (
    <Modal isOpen={deviceId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>
          Are you sure you want to delete the '{device?.mac || deviceId}' device?
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
