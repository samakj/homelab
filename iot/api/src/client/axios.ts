/** @format */
import _axios from 'axios';

export const axios = _axios.create({
  baseURL: 'http://127.0.0.1:8080',
  validateStatus: (status) => status < 500,
});
