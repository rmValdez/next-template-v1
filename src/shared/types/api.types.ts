export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export class ApiError extends Error {
  public code?: string;
  public details?: Record<string, string[]>;
  public status: number;

  constructor(status: number, data: ApiErrorResponse) {
    super(data.message || `HTTP Error: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = data.code;
    this.details = data.details;
  }
}
