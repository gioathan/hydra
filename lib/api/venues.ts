import { apiClient } from '../api';
import type { PagedResult, VenueDto, AvailabilityResponse, RateVenueRequest } from '../../types';

export async function getVenues(
  page = 1,
  pageSize = 25,
  venueTypeId?: string | null,
  name?: string
): Promise<PagedResult<VenueDto>> {
  const { data } = await apiClient.get<PagedResult<VenueDto>>('/venues', {
    params: {
      page,
      pageSize,
      ...(venueTypeId ? { venueTypeId } : {}),
      ...(name ? { name } : {}),
    },
  });
  return data;
}

export async function getVenue(id: string): Promise<VenueDto> {
  const { data } = await apiClient.get<VenueDto>(`/venues/${id}`);
  return data;
}

export async function rateVenue(venueId: string, body: RateVenueRequest): Promise<void> {
  await apiClient.post(`/venues/${venueId}/rate`, body);
}

export async function getAvailability(
  venueId: string,
  date: string,
  partySize: number
): Promise<AvailabilityResponse> {
  const { data } = await apiClient.get<AvailabilityResponse>('/bookings/availability', {
    params: { venueId, date, partySize },
  });
  return data;
}
