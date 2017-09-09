/* eslint-disable no-param-reassign */

import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import constants from './constants';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import { decodeToken } from '../services/auth';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// build a middleware for our auth solution
// every request we check if the user can be decoded
// otherwise we dont have a user, and so we can check
// in each request with "requireAuth" if a valid credential
// was transferred.
async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token != null) {
      const user = await decodeToken(token);
      req.user = user;
    } else {
      req.user = null; // destroy user, token cant be decoded
    }
    return next();
  } catch (error) {
    throw error;
  }
}

export default app => {
  // use module body-parser to parse all json data from and to the frontend
  app.use(bodyParser.json());

  // on each request we get a check if a token is given and if it can be decoded
  app.use(auth);

  // setup graphiql, its an ide for queries
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: constants.GRAPHQL_PATH,
    }),
  );

  // setup graphql, its like rest for ajax, works with queries
  // so the frontend can request with queries, but graphql only allow
  // specified content back and forth...
  app.use(
    constants.GRAPHQL_PATH,
    graphqlExpress(req => ({
      schema,
      context: {
        user: req.user, // part of the auth, graphql now knows the user as a context param...
      },
    })),
  );
};
