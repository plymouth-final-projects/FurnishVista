import type { AuthResponse, LoginCredentials, SignupData, User } from '@/types/auth.types';
import { requestJson } from './api';

type BackendAuthResponse = {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function normalizeRole(role: string): User['role'] {
  return role === 'admin' ? 'admin' : 'designer';
}

function toAuthResponse(data: BackendAuthResponse): AuthResponse {
  return {
    token: data.token,
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      role: normalizeRole(data.role),
      createdAt: data.createdAt,
    },
  };
}

/** Authenticate a user with email and password */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const data = await requestJson<BackendAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return toAuthResponse(data);
}

/** Register a new user */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  const response = await requestJson<BackendAuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return toAuthResponse(response);
}

/** Request password reset email */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const data = await requestJson<Record<string, string>>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return { message: data.message ?? 'Password reset link sent to your email' };
}

/** Get current user profile */
export async function getCurrentUser(): Promise<AuthResponse['user']> {
  const data = await requestJson<BackendAuthResponse>('/api/auth/me', {
    method: 'GET',
  });

  return toAuthResponse(data).user;
}

/** Logout current user */
export async function logoutUser(): Promise<void> {
  await requestJson<Record<string, string>>('/api/auth/logout', {
    method: 'POST',
  });
}
