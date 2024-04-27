import { ErrorWithStatus, StandardResponse } from "./types";
import { NextFunction, Response } from "express";

export function setSuccessResponse<T = undefined | null>(
  resp: Response<StandardResponse<T>>,
  result: T
) {
  resp.status(200).json({
    success: true,
    data: result,
    message: "success",
  });
}

export function duplicateUserSuccessResponse<T = undefined | null>(
  resp: Response<StandardResponse<T>>,
  result: T
) {
  resp.status(200).json({
    success: true,
    data: result,
    message: "success",
    userExist: true,
  });
}

export function setFailureResponse<T = undefined | null>(
  resp: Response<StandardResponse<T>>,
  message: string = "Action failed"
) {
  resp.status(200).json({
    success: false,
    data: null,
    message: message,
  });
}

export function setErrorWithMessageResponse<T = undefined | null>(
  resp: Response<StandardResponse<T>>,
  message: string = "Error occurred"
) {
  resp.status(500).json({
    success: false,
    data: null,
    message: message,
  });
}

export function setErrorResponse<T = undefined | null>(
  resp: Response,
  error: ErrorWithStatus
) {
  resp.status(error?.status ?? 500).json({
    success: false,
    data: null,
    message: error.message,
  });
}

export function setErrorResponseInNext(next: NextFunction, message: string) {
  next({
    success: false,
    data: null,
    message: message,
  });
}
