/** @format */
import { server } from '@/server';

import config from './config.secret.json';

server.listen({ port: config.port }, (error) => {
  if (error) {
    console.error(error);
    server.close();
    process.exit(1);
  }
});
