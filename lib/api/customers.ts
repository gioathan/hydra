import { apiClient } from '../api';
import type { CustomerDto, UpdateCustomerRequest } from '../../types';

export async function getCustomer(id: string): Promise<CustomerDto> {
  const { data } = await apiClient.get<CustomerDto>(`/customers/${id}`);
  return data;
}

export async function updateCustomer(
  id: string,
  body: UpdateCustomerRequest
): Promise<CustomerDto> {
  const { data } = await apiClient.put<CustomerDto>(`/customers/${id}`, body);
  return data;
}

export async function updatePushToken(id: string, pushToken: string): Promise<{ message: string }> {
  const { data } = await apiClient.put<{ message: string }>(
    `/customers/${id}/push-token`,
    { pushToken }
  );
  return data;
}

export async function deletePushToken(id: string): Promise<void> {
  await apiClient.delete(`/customers/${id}/push-token`);
}
