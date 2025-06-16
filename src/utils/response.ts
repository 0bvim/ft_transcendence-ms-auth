import { ApiResponse, ErrorResponse } from "../types/common.types";

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = (
  message: string,
  error?: string,
  statusCode?: number,
): ErrorResponse => ({
  success: false,
  message,
  error,
  statusCode,
});

// NOTE: Add more if needed later, I just added the most common ones.
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
