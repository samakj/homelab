/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { createLocation, updateLocation } from '../../../store/slices/locations/thunks';
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
  const [localTags, setLocalTags] = useState('');

  const canSave = useMemo(() => localName && localTags, [localName, localTags]);
  const createError = useSelector((state) => state.locations.requests.createLocation.error);

  const save = useCallback(() => {
    if (access_token)
      dispatch(
        createLocation({
          access_token,
          location: {
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
  }, [dispatch, access_token, localName, localTags]);

  const _close = useCallback(() => {
    setLocalName('');
    setLocalTags('');
    close();
  }, [setLocalName, setLocalTags, close]);

  return (
    <Modal isOpen={isOpen} close={_close}>
      <ModalContentElement>
        <ModalTitleElement>Create Location</ModalTitleElement>
        <CreateModalBodyElement>
          {createError?.json?.detail
            ? JSON.stringify(createError.json.detail)
            : createError?.message || 'Unknown Error'}
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
