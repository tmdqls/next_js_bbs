export interface UserJwtPayload {
    id: number;
    email: string;
    name: string;
    role?: string;
    iat?: number;
    exp?: number;
  }