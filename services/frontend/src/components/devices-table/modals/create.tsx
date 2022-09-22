/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { createDevice } from '../../../store/slices/devices/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { CreateModalPropsType } from '../types';
import { Input } from '../../input';
import { CreateModalBodyElement, ErrorElement } from '../elements';

export const CreateModal: React.FunctionComponent<CreateModalPropsType> = ({ close, isOpen }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const [localMac, setLocalMac] = useState('');
  const [localIp, setLocalIp] = useState('');
  const [localWebsocketPath, setLocalWebsocketPath] = useState('');
  const [localLocationId, setLocalLocationId] = useState('');
  const [localLastMessage, setLocalLastMessage] = useState('');

  const canSave = useMemo(
    () => localMac && localIp && localWebsocketPath && localLocationId,
    [localMac, localIp, localWebsocketPath, localLocationId, localLastMessage]
  );
  const createError = useSelector((state) => state.devices.requests.createDevice.error);

  const save = useCallback(() => {
    if (access_token)
      dispatch(
        createDevice({
          access_token,
          device: {
            mac: localMac,
            ip: localIp,
            websocket_path: localWebsocketPath,
            location_id: parseInt(localLocationId),
            last_message: localLastMessage || undefined,
          },
        })
      ).then((action) => {
        if (action.type === createDevice.fulfilled.type) close?.();
      });
  }, [
    dispatch,
    access_token,
    localMac,
    localIp,
    localWebsocketPath,
    localLocationId,
    localLastMessage,
  ]);

  const _close = useCallback(() => {
    setLocalMac('');
    setLocalIp('');
    setLocalWebsocketPath('');
    setLocalLocationId('');
    setLocalLastMessage('');
    close?.();
  }, [
    setLocalMac,
    setLocalIp,
    setLocalWebsocketPath,
    setLocalLocationId,
    setLocalLastMessage,
    close,
  ]);

  return (
    <Modal isOpen={isOpen} close={_close}>
      <ModalContentElement>
        <ModalTitleElement>Create Device</ModalTitleElement>
        <CreateModalBodyElement>
          {createError && (
            <ErrorElement>
              {createError?.json?.detail
                ? JSON.stringify(createError.json.detail)
                : createError?.message || 'Unknown Error'}
            </ErrorElement>
          )}
          <Input
            type="text"
            label="MAC"
            value={localMac}
            onChange={(event) => setLocalMac(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="text"
            label="IP"
            value={localIp}
            onChange={(event) => setLocalIp(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="text"
            label="Websocket Path"
            value={localWebsocketPath}
            onChange={(event) => setLocalWebsocketPath(event.currentTarget.value.toLowerCase())}
          />
          <Input
            type="number"
            label="Location Id"
            value={localLocationId}
            onChange={(event) => setLocalLocationId(parseInt(event.currentTarget.value).toString())}
          />
          <Input
            type="datetime-local"
            label="Last Message"
            value={localLastMessage}
            onChange={(event) => setLocalLastMessage(event.currentTarget.value)}
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
