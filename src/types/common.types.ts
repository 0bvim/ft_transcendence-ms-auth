export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Config {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  projectName: string;
  cors: {
    origin: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string | number;
    refreshExpiresIn: string | number;
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
  rateLimit: {
    max: number;
    windowMs: number;
  };
  database: {
    url: string;
  };
}
