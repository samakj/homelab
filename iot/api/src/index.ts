/** @format */
import { server } from '@/server';

server.listen({ port: 8080 }, (error) => {
  if (error) {
    console.error(error);
    server.close();
    process.exit(1);
  }
});
