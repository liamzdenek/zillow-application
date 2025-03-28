import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-zillow-blue">
            Zillow Real Estate Professional Health Dashboard
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a 
                href="https://www.zillow.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zillow-blue hover:text-zillow-dark-blue"
              >
                Zillow.com
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};