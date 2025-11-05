export type UserType = {
  id: string;
  username: string;
  passwordHash?: string;
};

export interface AuthenticateRequest extends Request {
  user?: UserPayload; //{ username: string; admin?: boolean };
}
export type UserPayload = {
  user_id: string;
  name: string;
  email: string;
  picture?: string;
  is_admin: boolean;
};
