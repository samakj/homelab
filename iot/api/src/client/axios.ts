/** @format */
import _axios from 'axios';

import { hosts } from '@/configs/hosts.secret';

export const axios = _axios.create({
  baseURL: hosts.api,
  validateStatus: (status) => status < 500,
});
