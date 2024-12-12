/** @format */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { isIntegerString } from '@/common/numbers';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Main, PageGrid } from '@/components/page-structure';
import { GridCard } from '@/components/page-structure/cards';
import { Select } from '@/components/select';
import { SourceCard } from '@/components/source-card';
import { TBody, TD, TH, TR, Table } from '@/components/table';
import { DeviceLogMessageType, DeviceSourceType, DeviceType } from '@/models/device';
import { routes } from '@/router/routes';
import {
  useCreateDevice,
  useDeleteDevice,
  useDevice,
  useGetDevice,
  useUpdateDevice,
} from '@/store/slices/devices/hooks';
import { createDeviceThunk, deleteDeviceThunk } from '@/store/slices/devices/thunks';
import { useGetLocations, useLocations } from '@/store/slices/locations/hooks';
import { useGetMetrics, useMetrics } from '@/store/slices/metrics/hooks';

import styles from './styles.module.scss';
import { DevicePagePropsType } from './types';

const Device: React.FunctionComponent<DevicePagePropsType> = ({}) => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const id = useMemo(() => (_id && isIntegerString(_id) ? parseInt(_id) : undefined), [_id]);
  const isCreate = useMemo(() => _id === 'create', [_id]);
  const { getDevice } = useGetDevice();
  const { getLocations } = useGetLocations();
  const { getMetrics } = useGetMetrics();
  const { updateDevice } = useUpdateDevice();
  const { createDevice } = useCreateDevice();
  const { deleteDevice } = useDeleteDevice();
  const device = useDevice(id);
  const locations = useLocations();
  const sourcesRef = useRef<{ [path: string]: DeviceSourceType }>({});
  const [_trigger, setTrigger] = useState(0);
  const [reconnectTrigger, setReconnectTrigger] = useState(1);
  const messagesRef = useRef<DeviceLogMessageType[]>([]);
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectTriggerTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const watchdogTriggerTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [localDevice, setLocalDevice] = useState<Partial<DeviceType>>(device || {});

  useEffect(() => {
    if (!id && !isCreate) navigate(routes.devices.path);
  }, [navigate, id, isCreate]);

  useEffect(() => {
    if (id) getDevice({ id });
  }, [getDevice, id]);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  useEffect(() => {
    if (device) setLocalDevice(device);
  }, [device]);

  const queueRerender = useCallback(() => {
    if (!triggerTimeoutRef.current) {
      triggerTimeoutRef.current = setTimeout(() => {
        setTrigger(+new Date());
        clearTimeout(triggerTimeoutRef.current);
        triggerTimeoutRef.current = undefined;
      }, 300);
    }
  }, [setTrigger]);

  const queueReconnect = useCallback(() => {
    if (!reconnectTriggerTimeoutRef.current) {
      reconnectTriggerTimeoutRef.current = setTimeout(() => {
        setReconnectTrigger(+new Date());
        clearTimeout(reconnectTriggerTimeoutRef.current);
        reconnectTriggerTimeoutRef.current = undefined;
      }, 1000);
    }
  }, [setReconnectTrigger]);

  const handleLogMessage = useCallback(
    ({ data }: MessageEvent) => {
      messagesRef.current.push(JSON.parse(data));
      queueRerender();
      clearTimeout(watchdogTriggerTimeoutRef.current);
      watchdogTriggerTimeoutRef.current = setTimeout(() => {
        messagesRef.current.push({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Watchdog timeout triggered',
        });
        setReconnectTrigger(+new Date());
      }, 30000);
    },
    [queueRerender, setReconnectTrigger]
  );

  const handleReportMessage = useCallback(
    ({ data }: MessageEvent) => {
      const value = JSON.parse(data);
      sourcesRef.current[value.id] = value;
      queueRerender();
    },
    [queueRerender, setReconnectTrigger]
  );

  useEffect(() => {
    if (device?.ip && reconnectTrigger) {
      const logsWebsocket = new WebSocket(`ws://${device.ip}/logs`);
      logsWebsocket.onmessage = handleLogMessage;
      logsWebsocket.onerror = queueReconnect;
      logsWebsocket.onclose = queueReconnect;
      const reportsWebsocket = new WebSocket(`ws://${device.ip}/reports`);
      reportsWebsocket.onmessage = handleReportMessage;
      reportsWebsocket.onerror = queueReconnect;
      reportsWebsocket.onclose = queueReconnect;

      return () => {
        logsWebsocket.close();
        reportsWebsocket.close();
      };
    }
  }, [device?.ip, handleLogMessage, reconnectTrigger]);

  useEffect(() => {
    if (device?.ip && !Object.keys(sourcesRef.current).length && reconnectTrigger)
      fetch(`http://${device.ip}/sources`)
        .then((response) => response.json())
        .then((data) => (sourcesRef.current = data));
  }, [device?.ip, reconnectTrigger]);

  const onMACChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDevice({ ...(localDevice || {}), mac: event.currentTarget.value });
    },
    [localDevice]
  );

  const onIPChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDevice({ ...(localDevice || {}), ip: event.currentTarget.value });
    },
    [localDevice]
  );

  const onLastMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDevice({
        ...(localDevice || {}),
        last_message: event.currentTarget.value
          ? new Date(event.currentTarget.value).toISOString()
          : undefined,
      });
    },
    [localDevice]
  );

  const locationOptions = useMemo(
    () =>
      Object.values(locations).map((location) => ({ value: location.id, label: location.name })),
    [locations]
  );

  const selectedLocation = useMemo(
    () => locationOptions.find((option) => option.value === localDevice.location_id),
    [locationOptions, localDevice.location_id]
  );

  const onLocationChange = useCallback(
    (option: (typeof locationOptions)[0] | null) => {
      setLocalDevice({ ...(localDevice || {}), location_id: option?.value });
    },
    [localDevice]
  );

  const save = useCallback(() => {
    const { id, mac, ip, location_id, last_message } = localDevice;
    if (mac && ip && location_id) {
      if (isCreate)
        createDevice({
          mac,
          ip,
          location_id,
          last_message: last_message || undefined,
        }).then((action) => {
          if (createDeviceThunk.fulfilled.match(action)) {
            navigate(generatePath(routes.device.path, action.payload.data.id));
          }
        });
      else if (id)
        updateDevice({
          id,
          mac,
          ip,
          location_id,
          last_message: last_message || undefined,
        });
    }
  }, [localDevice, updateDevice, createDevice, navigate, isCreate]);

  const del = useCallback(() => {
    const { id } = localDevice;
    if (id) {
      deleteDevice({ id }).then((action) => {
        if (deleteDeviceThunk.fulfilled.match(action)) {
          navigate(routes.devices.path);
        }
      });
    }
  }, [deleteDevice, localDevice, navigate]);

  return (
    <Main>
      <PageGrid>
        <GridCard rowSpan={5} colSpan={3}>
          <Table>
            <TBody>
              <TR>
                <TH left>ID</TH>
                <TD right>{device?.id || '-'}</TD>
              </TR>
              <TR>
                <TH left>Mac</TH>
                <TD right>
                  <Input value={localDevice?.mac || ''} onChange={onMACChange} />
                </TD>
              </TR>
              <TR>
                <TH left>IP</TH>
                <TD right>
                  <Input value={localDevice?.ip || ''} onChange={onIPChange} />
                </TD>
              </TR>
              <TR>
                <TH left>Location</TH>
                <TD right>
                  <Select
                    value={selectedLocation}
                    options={locationOptions}
                    onChange={onLocationChange}
                  />
                </TD>
              </TR>
              <TR>
                <TH left>Last Message</TH>
                <TD right>
                  <Input
                    value={localDevice?.last_message?.replace('Z', '') || ''}
                    onChange={onLastMessageChange}
                    type="datetime-local"
                  />
                </TD>
              </TR>
            </TBody>
          </Table>
          <Button
            onClick={save}
            disabled={
              !(localDevice?.id || isCreate) ||
              !localDevice?.mac ||
              !localDevice?.ip ||
              !localDevice.location_id
            }
          >
            Save
          </Button>
          <Button onClick={del} disabled={!localDevice?.id}>
            Delete
          </Button>
        </GridCard>
        {Object.entries(sourcesRef.current).map(([path, source]) => (
          <SourceCard key={path} source={source} />
        ))}
        <GridCard rowSpan={5} colSpan={8} className={styles.terminalCard}>
          <div className={styles.terminal}>
            {messagesRef.current.map(({ timestamp, level, message }) => (
              <div key={timestamp} className={`${styles.terminalLine} ${styles[level]}`}>
                <span className={styles.timestamp}>{timestamp}</span>
                <span className={styles.level}>{level.padEnd(5, ' ')}</span>
                <span className={styles.message}>{message}</span>
              </div>
            ))}
          </div>
        </GridCard>
      </PageGrid>
    </Main>
  );
};

export default Device;
