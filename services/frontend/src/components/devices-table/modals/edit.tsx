/** @format */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthorisation } from '../../../routing/authorise';
import { useDispatch, useSelector } from '../../../store';
import { updateDevice } from '../../../store/slices/devices/thunks';
import { Button } from '../../button';
import { Modal } from '../../modal';
import { ModalActionsElement, ModalContentElement, ModalTitleElement } from '../../modal/elements';
import { EditModalPropsType } from '../types';
import { Input } from '../../input';
import { EditModalBodyElement, ErrorElement } from '../elements';

export const EditModal: React.FunctionComponent<EditModalPropsType> = ({ deviceId, close }) => {
  const dispatch = useDispatch();
  const { access_token } = useAuthorisation();
  const devices = useSelector((state) => state.devices.devices);
  const updateError = useSelector((state) => state.devices.requests.updateDevice.error);

  const device = useMemo(
    () => (deviceId != null ? devices?.[deviceId] : null),
    [devices, deviceId]
  );

  const [localMac, setLocalMac] = useState(device?.mac || '');
  const [localIp, setLocalIp] = useState(device?.ip || '');
  const [localWebsocketPath, setLocalWebsocketPath] = useState(device?.websocket_path || '');
  const [localLocationId, setLocalLocationId] = useState(device?.location_id?.toString() || '');
  const [localLastMessage, setLocalLastMessage] = useState(device?.last_message || '');

  useEffect(() => {
    if (device) {
      setLocalMac(device.mac);
      setLocalIp(device.ip);
      setLocalWebsocketPath(device.websocket_path);
      setLocalLocationId(device.location_id.toString());
      setLocalLastMessage(device.last_message || '');
    }
  }, [
    device,
    setLocalMac,
    setLocalIp,
    setLocalWebsocketPath,
    setLocalLocationId,
    setLocalLastMessage,
  ]);

  const canSave = useMemo(
    () => localMac && localIp && localWebsocketPath && localLocationId,
    [localMac, localIp, localWebsocketPath, localLocationId, localLastMessage]
  );

  const save = useCallback(() => {
    if (access_token && deviceId != null)
      dispatch(
        updateDevice({
          access_token,
          device: {
            id: deviceId,
            mac: localMac,
            ip: localIp,
            websocket_path: localWebsocketPath,
            location_id: parseInt(localLocationId),
            last_message: localLastMessage || undefined,
          },
        })
      ).then((action) => {
        if (action.type === updateDevice.fulfilled.type) close?.();
      });
  }, [
    dispatch,
    deviceId,
    access_token,
    localMac,
    localIp,
    localWebsocketPath,
    localLocationId,
    localLastMessage,
  ]);

  return (
    <Modal isOpen={deviceId != null} close={close}>
      <ModalContentElement>
        <ModalTitleElement>Update device '{device?.mac || deviceId}'</ModalTitleElement>
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
