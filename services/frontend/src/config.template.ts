/** @format */

export const config = {
  urls: {
    apis: {
      authorisation: 'http://${subdomains.apis.authorisation}.${hosts.apis}:${ports.apis.nginx}',
      iot: 'http://${subdomains.apis.iot}.${hosts.apis}:${ports.apis.nginx}',
    },
    scrapers: {
      devices: 'http://${subdomains.scrapers.devices}.${hosts.scrapers}:${ports.scrapers.nginx}',
    },
  },
};
