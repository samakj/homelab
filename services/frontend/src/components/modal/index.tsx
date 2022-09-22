/** @format */

import React, { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ModalBackgroundElement, ModalContainerElement, ModalRootElement } from './elements';
import { ModalPropsType, ModalRootPropsType } from './types';

const ROOT_ID = '_modal_root_';

export const ModalRoot: React.FunctionComponent<ModalRootPropsType> = () => (
  <ModalRootElement id={ROOT_ID} />
);

export const Modal: React.FunctionComponent<ModalPropsType> = ({ children, isOpen, close }) => {
  const onBackgroundClick = useCallback(() => close?.(), [close]);
  const onContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [close]
  );

  const root = useMemo(() => document.getElementById(ROOT_ID), []);

  if (!isOpen) return null;
  if (!root) return null;
  return createPortal(
    <ModalBackgroundElement onClick={onBackgroundClick}>
      <ModalContainerElement onClick={onContainerClick}>{children}</ModalContainerElement>
    </ModalBackgroundElement>,
    root
  );
};
