import { RequestHandler } from "express";
import { ErrorWithStatus, TokenModel } from "../helpers/types";
import { verify } from "jsonwebtoken";
import "dotenv/config";
export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"]; // Bearer token
    if (!authorization) throw new ErrorWithStatus("JWT is required", 400);
    console.log(`authorization ------`, authorization);
    const jwt = authorization.split(" ")[1];
    if (!jwt) throw new ErrorWithStatus(`Malformed JWT`, 400);

    if (!process.env.SECRET_KEY)
      throw new ErrorWithStatus(`Private key not found`, 400);

    const jwt_data = verify(jwt, process.env.SECRET_KEY) as TokenModel;
    req.token = jwt_data;
    console.log(`request token `, jwt_data);
    next();
  } catch (error) {
    next(error);
  }
};
