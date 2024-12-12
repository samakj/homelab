/** @format */
import { UserType } from '../user';

export interface SessionType {
  id: number;
  user_id: UserType['id'];
  created: string;
  disabled: boolean;
}
