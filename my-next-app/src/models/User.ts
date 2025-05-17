export const USER_FIELDS = {
  ID: "id",
  EMAIL: "email",
  NAME: "name",
  PASSWORD: "password",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  ROLE: "role",
} as const;

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}