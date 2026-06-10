import { apiClient } from '../api';
import type { PagedResult, VenueDto, AvailabilityResponse, RateVenueRequest, VenueEventDto } from '../../types';

export async function getVenues(
  page = 1,
  pageSize = 25,
  venueTypeId?: string | null,
  name?: string,
  location?: string | null
): Promise<PagedResult<VenueDto>> {
  const { data } = await apiClient.get<PagedResult<VenueDto>>('/venues', {
    params: {
      page,
      pageSize,
      ...(venueTypeId ? { venueTypeId } : {}),
      ...(name ? { name } : {}),
      ...(location ? { location } : {}),
    },
  });
  return data;
}

export async function getVenueLocations(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/venues/locations');
  return data;
}

export async function getVenue(id: string): Promise<VenueDto> {
  const { data } = await apiClient.get<VenueDto>(`/venues/${id}`);
  return data;
}

export async function rateVenue(venueId: string, body: RateVenueRequest): Promise<void> {
  await apiClient.post(`/venues/${venueId}/rate`, body);
}

export async function getVenueEvents(venueId: string): Promise<VenueEventDto[]> {
  const { data } = await apiClient.get<VenueEventDto[]>(`/venues/${venueId}/events`);
  return data;
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
