export interface AuthState {
  isAuthenticated: boolean;
}
// po co to?

export interface CredentialsType {
  username: string | undefined;
  password: string | undefined;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AuthTokenTypes {
  access: string | undefined;
  refresh: string | undefined;
}
