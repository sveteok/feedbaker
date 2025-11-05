export type UserType = {
  id: string;
  username: string;
  passwordHash?: string;
};

export interface User {
  name: string;
  email: string;
  picture?: string;
  is_admin?: boolean;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  client_id?: string;
}

export interface UserPayload {
  user_id: string;
  name: string;
  email: string;
  picture?: string;
  is_admin: boolean;
}

export interface AuthenticateRequest extends Request {
  user?: UserPayload;
}
