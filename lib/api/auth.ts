import { apiClient } from '../api';
import type {
  LoginRequest, LoginResponse, RegisterRequest, RegisterResponse,
  VerifyEmailRequest, ResendVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest,
} from '../../types';

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function registerCustomer(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/users/register/customer', body);
  return data;
}

export async function verifyEmail(body: VerifyEmailRequest): Promise<void> {
  await apiClient.post('/auth/verify-email', body);
}

export async function resendVerification(body: ResendVerificationRequest): Promise<void> {
  await apiClient.post('/auth/resend-verification', body);
}

export async function forgotPassword(body: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/auth/forgot-password', body);
}

export async function resetPassword(body: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/reset-password', body);
}
