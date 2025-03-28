import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { AppProvider } from './context/AppProvider';
import { Dashboard } from './pages/Dashboard';
import { Simulation } from './pages/Simulation';
import './styles.css';

// Define routes
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard
});

const simulationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/simulation',
  component: Simulation
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, simulationRoute]);
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
