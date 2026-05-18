import { apiClient } from '../api';
import type { PendingRatingDto } from '../../types';

export async function getPendingRatings(): Promise<PendingRatingDto[]> {
  const { data } = await apiClient.get<PendingRatingDto[]>('/ratings/pending');
  return data;
}
