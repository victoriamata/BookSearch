import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './utils/auth.js';

// Create a new ApolloServer instance with typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  // Start Apollo server and establish database connection
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware to parse incoming request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo middleware to GraphQL endpoint with authentication context
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  // Serve static assets from the client build directory if in production
  // if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), '../client/dist')));
  // }

  // Catch-all route to serve the single-page app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
  });

  // Start the server and log the API endpoint
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Initialize the server
startApolloServer();
