/** @format */

export interface UserType {
  id: number;
  username: string;
  password: string;
  scopes: string[];
}

export type UserNoPasswordType = Omit<UserType, 'password'>;
