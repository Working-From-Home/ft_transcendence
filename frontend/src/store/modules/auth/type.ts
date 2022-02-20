export interface UserLog {
  username: string;
  password: string;
}

export interface UserUp {
  username: string;
  email: string;
  password: string;
}

export interface FetchData {
  method: string;
  body: string;
  headers: Headers;
}

export interface AuthState {
  userId: number | null;
  token: string;
  tokenExpiration: string;
}