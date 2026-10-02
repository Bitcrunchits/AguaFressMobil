export type UserRole = 'vendedor' | 'cliente';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  nombre?: string;
  apellido?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export type Session = {
  token: string;
  refreshToken: string;
  user: User;
};