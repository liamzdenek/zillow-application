import { createRoute } from '@tanstack/react-router';
import { Dashboard } from '../pages/Dashboard';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});