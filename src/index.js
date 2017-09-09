/* eslint-disable no-console */

import express from 'express';
import { createServer } from 'http';

import './config/db';
import constants from './config/constants';
import middlewares from './config/middlewares';
import mocks from './mocks'; // import fake data to play with

const app = express();

middlewares(app);

const PORT = process.env.PORT || 3000;

const graphQLServer = createServer(app);

// mocks().then(() => {
  graphQLServer.listen(PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`App listen to port: ${constants.PORT}`);
    }
  });
// });
