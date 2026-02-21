import React from 'react';
import { Truck, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-tiger-orange text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-1.5 rounded-full">
               <Truck className="w-6 h-6 text-tiger-orange" />
            </div>
            <h1 className="text-xl font-black tracking-wider italic">ドラコンの虎</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium opacity-90">{user.branch}</p>
                  <p className="text-sm font-bold">{user.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-orange-600 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-20">
        {title && <h2 className="text-2xl font-bold text-tiger-dark mb-6 border-l-8 border-tiger-orange pl-4">{title}</h2>}
        {children}
      </main>
      
      {/* Decorative Footer */}
      <footer className="bg-tiger-dark text-white py-4 text-center text-xs opacity-80">
        <p>&copy; 2026 ドラコンの虎 Project. All rights reserved.</p>
        <p className="mt-1">Aim for the Top of Truck Drivers.</p>
      </footer>
    </div>
  );
};