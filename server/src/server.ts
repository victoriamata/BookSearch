import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './utils/auth.js';

const createServer = async () => {
  // Start Apollo server and establish database connection
  await db();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  return server;
};

const createApp = (server: ApolloServer) => {
  const app = express();
  process.env.PORT || 3001;

  // Middleware to parse incoming request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo middleware to GraphQL endpoint with authentication context
  app.use('/graphql', expressMiddleware(server, {
    context: authenticateToken as any,
  }));

  // Serve static assets from the client build directory if in production
  app.use(express.static(path.join(process.cwd(), '../client/dist')));

  // Catch-all route to serve the single-page app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
  });

  return app;
};

const startServer = async () => {
  // Create Apollo server and Express app
  const server = await createServer();
  const app = createApp(server);

  // Start the server and log the API endpoint
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Initialize the server
startServer();
