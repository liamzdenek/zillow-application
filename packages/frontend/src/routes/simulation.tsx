import { createRoute } from '@tanstack/react-router';
import { Simulation } from '../pages/Simulation';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/simulation',
  component: Simulation,
});