export interface ErrorDetail {
    field: string;
    message: string;
  }
  
export interface ErrorResponse {
    code: number;
    message: string;
    errors: ErrorDetail[];
  }