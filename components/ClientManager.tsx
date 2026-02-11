
import React from 'react';
import { ISPClient } from '../types';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';

interface ClientManagerProps {
  clients: ISPClient[];
  activeClientId: string;
  onSwitchClient: (id: string) => void;
  onAddClient: () => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, activeClientId, onSwitchClient, onAddClient }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Meus Clientes ISP</h2>
        <button 
          onClick={onAddClient}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div 
            key={client.id}
            onClick={() => onSwitchClient(client.id)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative group ${
              activeClientId === client.id 
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20 shadow-md' 
                : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${activeClientId === client.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Building2 size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
            <p className="text-xs text-slate-500 font-mono mb-4">{client.cnpj}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assinantes</p>
                <p className="text-sm font-bold text-slate-700">{client.subscribers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ERP</p>
                <p className="text-sm font-bold text-slate-700">{client.erp}</p>
              </div>
            </div>

            {activeClientId === client.id && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Selecionado</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;
