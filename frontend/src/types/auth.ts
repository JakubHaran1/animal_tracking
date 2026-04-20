export interface AuthState {
  isAuthenticated: boolean;
}
// po co to?

export interface CredentialsType {
  username: string | undefined;
  password: string | undefined;
}

export interface AuthTokenTypes {
  access: string | undefined;
  refresh: string | undefined;
}
