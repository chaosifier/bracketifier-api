import { ErrorRequestHandler, RequestHandler } from 'express';
import { setErrorResponse } from './response';
import { ErrorWithStatus, StandardResponse } from './types';

//Response<StandardResponse<T>>
export const commonErrorHandler: ErrorRequestHandler<StandardResponse, undefined, undefined, undefined> = (error, req, res, next) => {
    console.log(error);
    setErrorResponse(res, error);
    next();
}

export const noRouteMatchHandler: RequestHandler = (req, res, next) => {
    next(new ErrorWithStatus('Route not found', 404));
}