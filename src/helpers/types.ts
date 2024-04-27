export interface StandardResponse<T = undefined> {
  success: boolean;
  data: T | null;
  message: string;
  userExist?: boolean;
}

export class ErrorWithStatus extends Error {
  status?: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.status = statusCode;
  }
}

export interface PaginationRequestQueryModel {
  pageSize: number;
  pageNumber: number;
}

export interface LoginResponseModel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  jwtToken: string;
}

export interface TokenModel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
