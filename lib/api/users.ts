import { apiClient } from '../api';
import type { UpdatePasswordRequest } from '../../types';

export async function updatePassword(
  userId: string,
  body: UpdatePasswordRequest
): Promise<{ message: string }> {
  const { data } = await apiClient.put<{ message: string }>(`/users/${userId}`, body);
  return data;
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}
