import { apiClient } from '../api';
import type { PagedResult, VenueTypeDto } from '../../types';

export async function getVenueTypes(page = 1, pageSize = 25): Promise<PagedResult<VenueTypeDto>> {
  const { data } = await apiClient.get<PagedResult<VenueTypeDto>>('/venue-types', {
    params: { page, pageSize },
  });
  return data;
}
