export type ApiErrorResponse = {
  statusCode: number;
  message: string | string[];
  error?: string;
  details?: unknown;
};

export type ApiErrorType =
  | 'OFFLINE'
  | 'API_UNAVAILABLE'
  | 'HTTP_ERROR'
  | 'UNKNOWN';

export class ApiError extends Error {
  statusCode?: number;
  type: ApiErrorType;
  details?: unknown;

  constructor({
    message,
    type,
    statusCode,
    details,
  }: {
    message: string;
    type: ApiErrorType;
    statusCode?: number;
    details?: unknown;
  }) {
    super(message);

    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}