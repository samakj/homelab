/** @format */
import Head from 'preact-head';
import { useState } from 'preact/hooks';

import { Docs } from './components/docs';
import { LogsTerminal } from './components/logs-terminal';
import { Modal } from './components/modal';
import { PageGrid } from './components/page-grid';
import { Sources } from './components/sources';
import _styles from './styles/root.module.scss';

declare global {
  interface Window {
    deviceIp: string;
  }
}

export const App = () => {
  window.deviceIp =
    window.location.host && !window.location.host.includes('localhost')
      ? window.location.host
      : '192.168.1.112';

  const [modalSourceId, setModalSourceId] = useState<string>();
  const [modalType, setModalType] = useState<string>();
  const [content, setContent] = useState<'logs' | 'docs'>('logs');

  return (
    <>
      <Head>
        <title>{window.deviceIp} - Device Page</title>
      </Head>
      <PageGrid>
        <Sources
          setModalSourceId={setModalSourceId}
          setModalType={setModalType}
          content={content}
          setContent={setContent}
        />
        {content === 'logs' ? <LogsTerminal /> : content === 'docs' ? <Docs /> : null}
        <Modal
          sourceId={modalSourceId}
          setSourceId={setModalSourceId}
          modalType={modalType}
          setModalType={setModalType}
        />
      </PageGrid>
    </>
  );
};
