import { apiClient } from '../api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../types';

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function registerCustomer(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/users/register/customer', body);
  return data;
}
