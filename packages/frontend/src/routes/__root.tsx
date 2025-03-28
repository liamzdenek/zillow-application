import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/layout/Layout';

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <div className="flex gap-4 mb-4">
        <Link to="/" className="text-zillow-blue hover:text-zillow-dark-blue [&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/simulation" className="text-zillow-blue hover:text-zillow-dark-blue [&.active]:font-bold">
          Simulation
        </Link>
      </div>
      <Outlet />
    </Layout>
  ),
});