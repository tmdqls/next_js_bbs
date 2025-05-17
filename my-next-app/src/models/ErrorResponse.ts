export interface ErrorDetail {
    field: string;
    message: string;
  }
  
export interface ErrorResponse {
    status: number;
    message: string;
  }

  export interface ClientErrorResponse {
  message: string;
  error: ErrorDetail[];
}