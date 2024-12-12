/** @format */
import { useMemo } from 'react';

import { GridCard } from '@/components/page-structure/cards';

import styles from '../styles.module.scss';
import { NeopixelsSourceCardPropsType } from './types';

export const NeopixelsSourceCard: React.FunctionComponent<NeopixelsSourceCardPropsType> = ({
  source,
}) => {
  const size = useMemo(
    () => Math.ceil(Math.sqrt(source.pixelColours.length)),
    [source.pixelColours]
  );

  return (
    <GridCard className={styles.sourceGridCard}>
      <div
        className={styles.colourGrid}
        style={{
          gridTemplateColumns: Array(size)
            .fill(null)
            .map(() => '1fr')
            .join(' '),
          gridTemplateRows: Array(size)
            .fill(null)
            .map(() => '1fr')
            .join(' '),
        }}
      >
        {source.pixelColours.map(({ red, green, blue, white }, index) => (
          <div
            key={index}
            className={styles.pixel}
            style={{ backgroundColor: `rgba(${red},${green},${blue},${(255 - white) / 255})` }}
          />
        ))}
      </div>
      <span>Neopixel</span>
    </GridCard>
  );
};
