import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// Middleware to authenticate JWT token for protected routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized if no token is provided
    
  }

  // Extract token from authorization header
  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';
  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, user)=> {
    if (err) {
      return res.sendStatus(403); // Forbidden if the token is invalid
    }
    req.user = user as JwtPayload; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
    return;
  });
  return;
};

// Function to sign and generate a JWT token
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // Create and return a signed JWT token with 1 hour expiration
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
