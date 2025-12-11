import React from 'react';
import { ViewState } from '../types';
import { Home, PlusCircle, PieChart, History, PiggyBank } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="min-h-screen bg-rose-50 flex justify-center items-start font-sans text-gray-700">
      {/* 
         Mobile Container 
         Added pb-safe and pt-safe for iOS notch and home indicator handling 
      */}
      <div className="w-full max-w-md bg-white h-[100dvh] sm:h-[90vh] sm:my-8 sm:rounded-[3rem] shadow-2xl shadow-rose-200/50 relative overflow-hidden flex flex-col">
        
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-100 to-white -z-0 rounded-t-[3rem]" />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 relative z-10 overflow-y-auto no-scrollbar pb-32 pt-safe-top">
          {/* Add extra padding top for status bar on standalone mode */}
          <div className="pt-4 sm:pt-0">
             {children}
          </div>
        </main>

        {/* Floating Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
          {/* Safe area padding wrapper */}
          <div className="pb-[env(safe-area-inset-bottom)] pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-md h-20 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-rose-50 flex items-center justify-around px-2">
              <NavButton 
                active={activeView === 'dashboard'} 
                onClick={() => onNavigate('dashboard')} 
                icon={<Home size={24} />} 
                label="首页" 
              />
              <NavButton 
                active={activeView === 'history'} 
                onClick={() => onNavigate('history')} 
                icon={<History size={24} />} 
                label="明细" 
              />
              
              {/* Main Action Button */}
              <button 
                onClick={() => onNavigate('add')}
                className={`
                  w-14 h-14 rounded-full -mt-10 flex items-center justify-center shadow-lg transition-all duration-300 transform
                  ${activeView === 'add' ? 'bg-rose-500 scale-110 rotate-90' : 'bg-rose-400 hover:scale-105 hover:bg-rose-500'}
                  text-white border-4 border-white
                `}
              >
                <PlusCircle size={32} />
              </button>

              <NavButton 
                active={activeView === 'stats'} 
                onClick={() => onNavigate('stats')} 
                icon={<PieChart size={24} />} 
                label="统计" 
              />
              
              <NavButton 
                active={activeView === 'savings'} 
                onClick={() => onNavigate('savings')} 
                icon={<PiggyBank size={24} />} 
                label="存钱" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Helper for safe areas if Tailwind plugin is not available */}
      <style>{`
        .pt-safe-top {
          padding-top: env(safe-area-inset-top, 20px);
        }
        .pb-safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${active ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);