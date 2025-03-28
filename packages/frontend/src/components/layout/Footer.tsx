import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zillow-dark-gray text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Zillow Group, Inc. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://www.zillow.com/z/corp/terms/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-white"
            >
              Terms of Use
            </a>
            <a 
              href="https://www.zillow.com/z/corp/privacy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-white"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};