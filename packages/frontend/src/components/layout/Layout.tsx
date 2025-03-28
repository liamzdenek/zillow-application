import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zillow-gray">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};