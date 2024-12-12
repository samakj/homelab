/** @format */
import { useCallback } from 'preact/hooks';

import styles from './styles.module.scss';
import { SourceModalProps } from './types';

export const IRSenderModal: React.FunctionComponent<SourceModalProps> = ({
  sourceId,
  setSourceId,
  setModalType,
}) => {
  const close = useCallback(() => {
    setModalType(undefined);
    setSourceId(undefined);
  }, [setModalType, setSourceId]);

  const sendIRCommand = useCallback(
    (command: string) => {
      fetch(`http://${window.deviceIp}/${sourceId}`, {
        method: 'POST',
        body: JSON.stringify({
          commandString: command,
          source: 'tv',
        }),
      });
    },
    [sourceId]
  );

  return (
    <>
      <div className={styles.modalBackdrop} onClick={close} />
      <div className={styles.modal}>
        <div>IR Remote Sender: {sourceId}</div>
        <button onClick={() => sendIRCommand('power')}>power</button>
        <button onClick={() => sendIRCommand('ok')}>ok</button> <br />
        <button onClick={() => sendIRCommand('up')}>up</button>
        <button onClick={() => sendIRCommand('down')}>down</button>
        <button onClick={() => sendIRCommand('left')}>left</button>
        <button onClick={() => sendIRCommand('right')}>right</button> <br />
        <button onClick={() => sendIRCommand('0')}>0</button>
        <button onClick={() => sendIRCommand('1')}>1</button>
        <button onClick={() => sendIRCommand('2')}>2</button>
        <button onClick={() => sendIRCommand('3')}>3</button>
        <button onClick={() => sendIRCommand('4')}>4</button>
        <button onClick={() => sendIRCommand('5')}>5</button>
        <button onClick={() => sendIRCommand('6')}>6</button>
        <button onClick={() => sendIRCommand('7')}>7</button>
        <button onClick={() => sendIRCommand('8')}>8</button>
        <button onClick={() => sendIRCommand('9')}>9</button> <br />
        <button onClick={() => sendIRCommand('guide')}>guide</button>
        <button onClick={() => sendIRCommand('mute')}>mute</button>
        <button onClick={() => sendIRCommand('home')}>home</button>
        <button onClick={() => sendIRCommand('source')}>source</button>
        <button onClick={() => sendIRCommand('back')}>back</button>
        <button onClick={() => sendIRCommand('settings')}>settings</button> <br />
        <button onClick={() => sendIRCommand('red-button')}>red-button</button>
        <button onClick={() => sendIRCommand('green-button')}>green-button</button>
        <button onClick={() => sendIRCommand('yellow-button')}>yellow-button</button>
        <button onClick={() => sendIRCommand('blue-button')}>blue-button</button> <br />
        <button onClick={() => sendIRCommand('netflix')}>netflix</button>
        <button onClick={() => sendIRCommand('prime')}>prime</button>
        <button onClick={() => sendIRCommand('disney')}>disney</button>
        <button onClick={() => sendIRCommand('raktuken')}>raktuken</button>
        <button onClick={() => sendIRCommand('lg-channels')}>lg-channels</button>
      </div>
    </>
  );
};
