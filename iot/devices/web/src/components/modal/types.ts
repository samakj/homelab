/** @format */

export interface ModalPropsType {
  sourceId?: string;
  modalType?: string;
  setSourceId: (sourceId?: string) => void;
  setModalType: (modalType?: string) => void;
}

export interface SourceModalProps {
  sourceId: string;
  setSourceId: (sourceId?: string) => void;
  setModalType: (modalType?: string) => void;
}
