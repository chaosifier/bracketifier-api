declare namespace Express {
  interface Request {
    token: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }
}
