// starter code from class assignment

declare namespace Express {
  interface Request {
    user: {
      _id: unknown;
      username: string;
    };
  }
}
