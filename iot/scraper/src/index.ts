/** @format */
import { server } from '@/server';

import config from './config.secret.json';
import { scrapeDevices } from './devices';
import { Scheduler } from './scheduler';

server.listen({ port: config.port }, (error) => {
  if (error) {
    console.error(error);
    server.close();
    process.exit(1);
  }
});

const scheduler = new Scheduler(server);

scheduler.addTask('scrapeDevices', scrapeDevices, 30000);

const main = async () => {
  while (true) {
    await scheduler.loop();
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

process.on('SIGINT', () => {
  console.log('Recieved close');
  process.exit(0);
});

main();
