export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'designer' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
