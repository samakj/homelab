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

export enum WebsocketMessageActionsEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type WebsocketMessageType<
  Resource extends string,
  DataKeys extends string,
  DataType extends {},
  Action extends WebsocketMessageActionsEnum = WebsocketMessageActionsEnum
> = {
  action: Action;
  resource: Resource;
} & {
  [key in DataKeys]: DataType;
};
