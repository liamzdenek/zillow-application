import { apiClient } from './client';
import { SimulationRequest, SimulationResponse } from 'shared';

export const runSimulation = async (request: SimulationRequest): Promise<SimulationResponse> => {
  const { data } = await apiClient.post('/simulate', request);
  return data;
};