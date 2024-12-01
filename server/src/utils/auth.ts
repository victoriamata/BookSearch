import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // Extract token from authorization header if present
  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  // If no token is provided, return the request unmodified
  if (!token) {
    return req;
  }

  // Verify the token and set user data on the request object
  try {
    const { data }: any = jwt.verify(token, JWT_SECRET_KEY, { maxAge: '2h' });
    req.user = data;
  } catch (err) {
    console.log('Invalid token');
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };

  // Sign the token with the provided payload and secret key
  return jwt.sign({ data: payload }, JWT_SECRET_KEY, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' }
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
