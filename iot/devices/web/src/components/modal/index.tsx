/** @format */
import { IRSenderModal } from './ir-sender';
import { NeopixelsModal } from './neopixels';
import { ModalPropsType } from './types';

export const Modal: React.FunctionComponent<ModalPropsType> = ({
  sourceId,
  modalType,
  setModalType,
  setSourceId,
}) => {
  if (modalType === 'neopixels' && sourceId)
    return (
      <NeopixelsModal sourceId={sourceId} setSourceId={setSourceId} setModalType={setModalType} />
    );
  if (modalType === 'ir-sender' && sourceId)
    return (
      <IRSenderModal sourceId={sourceId} setSourceId={setSourceId} setModalType={setModalType} />
    );

  return null;
};
