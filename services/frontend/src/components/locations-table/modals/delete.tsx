/** @format */

import React, { useCallback, useMemo } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { deleteLocation } from '../../../store/slices/locations/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { DeleteModalPropsType } from '../types';

export const DeleteModal: React.FunctionComponent<DeleteModalPropsType> = ({
  locationId,
  close,
}) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const locations = useSelector((state) => state.locations.locations);

  const location = useMemo(
    () => (locationId != null ? locations?.[locationId] : null),
    [locations, locationId]
  );

  const _delete = useCallback(() => {
    if (access_token && locationId != null)
      dispatch(deleteLocation({ id: locationId, access_token })).then((action) => {
        if (action.type === deleteLocation.fulfilled.type) close?.();
      });
  }, [dispatch, locationId]);

  return (
    <Modal isOpen={locationId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>
          Are you sure you want to delete the '{location?.name || locationId}' location?
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
