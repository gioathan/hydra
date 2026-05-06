import { apiClient } from '../api';
import type { BookingDto, CreateBookingRequest, PagedResult, BookingStatus } from '../../types';

export async function createBooking(body: CreateBookingRequest): Promise<BookingDto> {
  const { data } = await apiClient.post<BookingDto>('/bookings', body);
  return data;
}

export async function getBookings(
  customerId: string,
  status?: BookingStatus,
  page = 1,
  pageSize = 25
): Promise<PagedResult<BookingDto>> {
  const { data } = await apiClient.get<PagedResult<BookingDto>>('/bookings', {
    params: { customerId, status, page, pageSize },
  });
  return data;
}

export async function getBooking(id: string): Promise<BookingDto> {
  const { data } = await apiClient.get<BookingDto>(`/bookings/${id}`);
  return data;
}

export async function cancelBooking(id: string, reason: string | null): Promise<BookingDto> {
  const { data } = await apiClient.post<BookingDto>(`/bookings/${id}/cancel`, { reason });
  return data;
}
