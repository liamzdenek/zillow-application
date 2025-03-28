import { apiClient } from './client';
import { SegmentsResponse } from 'shared';

export const getSegments = async (): Promise<SegmentsResponse> => {
  const { data } = await apiClient.get('/segments');
  return data;
};