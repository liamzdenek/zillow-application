import { apiClient } from './client';
import { MetricsRequest, MetricsResponse } from 'shared';

export const getMetrics = async (request: MetricsRequest = {}): Promise<MetricsResponse> => {
  const { data } = await apiClient.get('/metrics', { params: request });
  return data;
};