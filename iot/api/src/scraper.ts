/** @format */
import { getDevices, updateDevice } from './client/devices';

const main = async () => {
  while (true) {
    const response = await getDevices();

    const pingResponses = await Promise.all(
      response.data.map((device) =>
        fetch(`http://${device.ip}/ping`)
          .then((response) => response.json())
          .catch(() => Promise.resolve(null))
      )
    );

    response.data.forEach(async (device, index) => {
      const alive = pingResponses[index]?.ping === 'pong';

      if (alive) {
        await updateDevice({ id: device.id, last_message: new Date().toISOString() });
      }

      console.log(device.mac, alive);
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

process.on('SIGINT', () => {
  console.log('Recieved close');
});

main();
