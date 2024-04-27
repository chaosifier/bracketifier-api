import { RequestHandler } from "express";
import { User, UserModel } from "../users/users.schema";
import {
  setErrorResponse,
  setFailureResponse,
  setSuccessResponse,
  duplicateUserSuccessResponse,
} from "../helpers/response";
import {
  ErrorWithStatus,
  LoginResponseModel,
  StandardResponse,
} from "../helpers/types";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { createUser, getUserById } from "./users.services";

export const signin_user_handler: RequestHandler<
  unknown,
  StandardResponse<LoginResponseModel>,
  { email: string; password: string },
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserById(email);
    if (!user) {
      throw new ErrorWithStatus(`User not found`, 404);
    }

    const match = await compare(password, user.password);
    if (!match) throw new ErrorWithStatus(`Wrong password`, 404);
    if (!process.env.SECRET_KEY)
      throw new ErrorWithStatus(`No Private Key`, 500);
    const payload = {
      _id: user._id.toString(),
      firstName: user.name?.first || "",
      lastName: user.name?.last || "",
      email: user.email,
    };
    const jwt = sign(payload, process.env.SECRET_KEY as string);

    setSuccessResponse(res, { ...payload, jwtToken: jwt });
  } catch (error) {
    if (error instanceof ErrorWithStatus) {
      setErrorResponse(res, error);
    }
    next(error);
  }
};

export const signup_user_handler: RequestHandler<
  unknown,
  StandardResponse<string>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new ErrorWithStatus(`Invalid user`, 404);
    }
    const user = req.body;
    const userExist = await getUserById(user.email);
    if (userExist) {
      duplicateUserSuccessResponse(
        res,
        `Already have user ${user.name?.first}`
      );
      return;
    }
    console.log(`create user `, user);
    const result = await createUser(user);
    console.log(result);
    setSuccessResponse(res, `User ${user.name?.first} signup success`);
  } catch (error) {
    if (error instanceof ErrorWithStatus) {
      setErrorResponse(res, error);
    }
    next(error);
  }
};
