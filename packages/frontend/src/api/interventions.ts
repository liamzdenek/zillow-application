import { apiClient } from './client';
import { InterventionsResponse } from 'shared';

export const getInterventions = async (): Promise<InterventionsResponse> => {
  const { data } = await apiClient.get('/interventions');
  return data;
};