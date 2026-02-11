
import React from 'react';
import { MENU_ITEMS } from '../constants.tsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight text-white uppercase">Consult ISP</span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 m-4 bg-slate-800/50 rounded-2xl">
        <p className="text-xs text-slate-500 mb-1">Logado como</p>
        <p className="text-sm font-semibold text-white">Consultor Sênior</p>
      </div>
    </aside>
  );
};

export default Sidebar;
