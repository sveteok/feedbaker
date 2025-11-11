import { Request } from "express";

export type UserType = {
  id: string;
  username: string;
  passwordHash?: string;
};

export type UserPayload = {
  user_id: string;
  name: string;
  email: string;
  picture?: string;
  is_admin: boolean;
};

export interface AuthenticateRequest extends Request {
  user?: UserPayload;
}
export interface PaginatedUsers {
  users: UserPayload[];
  totalCount: number;
}
