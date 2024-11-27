import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing and CORS
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server setup
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Integrate Apollo Server middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Add user info to the context after token validation
        const token = req.headers.authorization?.split(' ')[1] || '';
        const user = await authenticateToken(token);
        return { user };
      },
    })
  );
};

// Static assets for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// REST API routes
app.use(routes);

// Start the database and servers
db.once('open', async () => {
  await startApolloServer();
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});
