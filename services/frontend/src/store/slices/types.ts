/** @format */

export interface RequestMetaType {
  isLoading: boolean;
  error?: {};
  started?: string;
  finished?: string;
}

export const initialRequestMeta = {
  isLoading: false,
};
