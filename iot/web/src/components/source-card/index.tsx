/** @format */
import {
  DeviceSourceType,
  isDeviceButtonSourceType,
  isDeviceDHTSourceType,
  isDeviceNTPSourceType,
  isDeviceNeopixelsSourceType,
  isDeviceRotaryEncoderSourceType,
  isDeviceTEMT6000SourceType,
  isDeviceWifiSourceType,
} from '@/models/device';

import { GridCard } from '../page-structure/cards';
import { ButtonSourceCard } from './button-source-card';
import { DHTSourceCard } from './dht-source-card';
import { NeopixelsSourceCard } from './neopixel-source-card';
import { NTPSourceCard } from './ntp-source-card';
import { RotaryEncoderSourceCard } from './rotary-encoder-source-card';
import { TEMT6000SourceCard } from './temt6000-source-card';
import { SourceCardPropsType } from './types';
import { WifiSourceCard } from './wifi-source-card';

export const SourceCard: React.FunctionComponent<SourceCardPropsType> = ({ source }) => {
  return isDeviceButtonSourceType(source) ? (
    <ButtonSourceCard source={source} />
  ) : isDeviceDHTSourceType(source) ? (
    <DHTSourceCard source={source} />
  ) : isDeviceNeopixelsSourceType(source) ? (
    <NeopixelsSourceCard source={source} />
  ) : isDeviceNTPSourceType(source) ? (
    <NTPSourceCard source={source} />
  ) : isDeviceTEMT6000SourceType(source) ? (
    <TEMT6000SourceCard source={source} />
  ) : isDeviceRotaryEncoderSourceType(source) ? (
    <RotaryEncoderSourceCard source={source} />
  ) : isDeviceWifiSourceType(source) ? (
    <WifiSourceCard source={source} />
  ) : (
    <GridCard>
      <span>{(source as DeviceSourceType).type}</span>
    </GridCard>
  );
};
