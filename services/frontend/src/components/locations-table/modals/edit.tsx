/** @format */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { updateLocation } from '../../../store/slices/locations/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { EditModalPropsType } from '../types';
import { Input } from '../../input';
import { EditModalBodyElement, ErrorElement } from '../elements';

export const EditModal: React.FunctionComponent<EditModalPropsType> = ({ locationId, close }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const locations = useSelector((state) => state.locations.locations);
  const updateError = useSelector((state) => state.locations.requests.updateLocation.error);

  const location = useMemo(
    () => (locationId != null ? locations?.[locationId] : null),
    [locations, locationId]
  );

  const [localName, setLocalName] = useState(location?.name || '');
  const [localTags, setLocalTags] = useState(location?.tags?.join(', ') || '');

  useEffect(() => {
    if (location) {
      setLocalName(location.name);
      setLocalTags(location.tags.join(', '));
    }
  }, [location, setLocalName, setLocalTags]);

  const canSave = useMemo(() => localName && localTags, [localName, localTags]);

  const save = useCallback(() => {
    if (access_token && locationId != null)
      dispatch(
        updateLocation({
          access_token,
          location: {
            id: locationId,
            name: localName,
            tags: localTags
              .replace(/\s/g, '')
              .split(',')
              .filter((tag) => !!tag),
          },
        })
      ).then((action) => {
        if (action.type === updateLocation.fulfilled.type) close?.();
      });
  }, [dispatch, locationId, access_token, localName, localTags]);

  return (
    <Modal isOpen={locationId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>Update location '{location?.name || locationId}'</ModalTitleElement>
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
            label="Tags"
            value={localTags}
            onChange={(event) => setLocalTags(event.currentTarget.value.toLowerCase())}
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
