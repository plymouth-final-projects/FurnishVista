import type { AuthResponse, LoginCredentials, SignupData } from '@/types/auth.types';
import { mockUser } from '@/lib/mock-data';

/** Simulates network delay for realistic UX */
function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Authenticate a user with email and password */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay();

  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  // Mock: accept any valid-looking email with password length >= 6
  if (credentials.password.length < 6) {
    throw new Error('Invalid email or password');
  }

  return {
    user: { ...mockUser, email: credentials.email },
    token: 'mock-jwt-token-' + Date.now(),
  };
}

/** Register a new user */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  await delay(1000);

  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  return {
    user: {
      ...mockUser,
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
}

/** Request password reset email */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  await delay();

  if (!email) {
    throw new Error('Email is required');
  }

  return { message: 'Password reset link sent to your email' };
}

/** Get current user profile */
export async function getCurrentUser(): Promise<AuthResponse['user']> {
  await delay(300);
  return { ...mockUser };
}
