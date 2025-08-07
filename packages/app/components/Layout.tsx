import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
