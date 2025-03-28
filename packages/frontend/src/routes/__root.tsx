import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/layout/Layout';

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <div className="flex gap-4 mb-4">
        <Link
          to="/"
          className="text-zillow-blue hover:text-zillow-dark-blue font-medium px-3 py-1 rounded-md hover:bg-gray-100 [&.active]:bg-gray-200"
          style={{ textDecoration: 'none' }}
        >
          Dashboard
        </Link>
        <Link
          to="/simulation"
          className="text-zillow-blue hover:text-zillow-dark-blue font-medium px-3 py-1 rounded-md hover:bg-gray-100 [&.active]:bg-gray-200"
          style={{ textDecoration: 'none' }}
        >
          Simulation
        </Link>
      </div>
      <Outlet/>
    </Layout>
  ),
});