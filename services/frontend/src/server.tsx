/** @format */

import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';

const PORT = 8085;
const BUILD_DIR = path.resolve(__dirname, '..');
const server = express();

server.use(express.static(BUILD_DIR));
server.use('*', (request, response) => {
  const app = renderToString(<App location={request.originalUrl} />);
  const html = fs
    .readFileSync(path.resolve(BUILD_DIR, 'index.html'), { encoding: 'utf8' })
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`);

  // set header and status
  response.contentType('text/html');
  response.status(200);

  return response.send(html);
});
server.listen(PORT, () => console.log(`Express server started at http://localhost:${PORT}`));
