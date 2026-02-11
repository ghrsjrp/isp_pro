
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManager from './components/ClientManager';
import ServicesView from './components/ServicesView';
import ChecklistView from './components/ChecklistView';
import StatusBadge from './components/StatusBadge';
import GenericModal from './components/GenericModal';
import { CRUDTable } from './components/CRUDTable';
import { Bell, Search, Users, Settings } from 'lucide-react';
import { MENU_ITEMS, MOCK_CLIENTS, MOCK_CONNECTIVITY, MOCK_ROUTERS, MOCK_SWITCHES, MOCK_OLTS } from './constants';
import { ISPClient, Connectivity, Router, Switch, OLT } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeClientId, setActiveClientId] = useState(MOCK_CLIENTS[0].id);
  
  const [clients, setClients] = useState<ISPClient[]>(MOCK_CLIENTS);
  const [connectivity, setConnectivity] = useState<Connectivity[]>(MOCK_CONNECTIVITY);
  const [routers, setRouters] = useState<Router[]>(MOCK_ROUTERS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'client' | 'connectivity' | 'router' | 'switch' | 'olt' | 'none'>('none');
  const [editingItem, setEditingItem] = useState<any>(null);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const handleOpenAdd = (type: any) => {
    setEditingItem(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: any, item: any) => {
    setEditingItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    alert('Operação simulada. Note que a Camada React opera sobre Mocks para visualização de Dashboard.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'isp-info': return (
        <div className="space-y-8">
           <ClientManager 
              clients={clients} 
              activeClientId={activeClientId} 
              onSwitchClient={setActiveClientId} 
              onAddClient={() => handleOpenAdd('client')}
           />
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative group">
             <button 
               onClick={() => handleOpenEdit('client', activeClient)}
               className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
             >
               <Settings size={18} />
             </button>
             <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">Documentação Corporativa: {activeClient.name}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Topologia Principal</p>
                 <p className="font-semibold text-slate-700">{activeClient.topology}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Responsável Técnico</p>
                 <p className="font-semibold text-slate-700">{activeClient.techContact}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Impacto de ASN</p>
                 <StatusBadge status={activeClient.subscribers > 10000 ? 'ALTO VOLUME' : 'NORMAL'} />
               </div>
               <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">SVA Ativos</p>
                 <p className="font-semibold text-slate-700">{activeClient.svas.length || 'Nenhum'}</p>
               </div>
             </div>
           </div>
        </div>
      );
      case 'connectivity': return (
        <CRUDTable<Connectivity> 
          title="Conectividade IP"
          data={connectivity}
          columns={[
            { header: 'Tipo', accessor: 'type' },
            { header: 'Fornecedor', accessor: 'provider' },
            { header: 'Capacidade', accessor: 'capacity' },
            { header: 'Porta', accessor: 'interface' },
            { header: 'Status', accessor: (item) => <StatusBadge status={item.status} /> }
          ]}
          onAdd={() => handleOpenAdd('connectivity')}
          onEdit={(item) => handleOpenEdit('connectivity', item)}
        />
      );
      case 'routers': return (
        <CRUDTable<Router> 
          title="Roteadores de Borda e Core"
          data={routers}
          columns={[
            { header: 'Hostname', accessor: 'hostname' },
            { header: 'Modelo', accessor: 'model' },
            { header: 'Função', accessor: 'function' },
            { header: 'Status', accessor: (item) => <StatusBadge status={item.backup ? 'SINC' : 'ALERTA'} /> }
          ]}
          onAdd={() => handleOpenAdd('router')}
          onEdit={(item) => handleOpenEdit('router', item)}
        />
      );
      case 'switches': return (
        <CRUDTable<Switch> 
          title="Switches de Agregação" 
          data={MOCK_SWITCHES} 
          columns={[
            { header: 'Hostname', accessor: 'hostname' },
            { header: 'Modelo', accessor: 'model' },
            { header: 'Versão', accessor: 'version' },
            { header: 'Camada', accessor: (item) => item.capabilities.includes('L3') ? 'L3' : 'L2' },
            { header: 'STP', accessor: (item) => <StatusBadge status={item.stp ? 'ATIVO' : 'OFF'} /> }
          ]} 
          onAdd={() => handleOpenAdd('switch')} 
          onEdit={(item) => handleOpenEdit('switch', item)}
        />
      );
      case 'olts': return (
        <CRUDTable<OLT> 
          title="Headends OLT" 
          data={MOCK_OLTS} 
          columns={[
            { header: 'Hostname', accessor: 'hostname' },
            { header: 'Modelo', accessor: 'model' },
            { header: 'Portas PON', accessor: 'ponPorts' },
            { header: 'Assinantes', accessor: 'subscribers' },
            { header: 'Vendor Status', accessor: (item) => <StatusBadge status={item.unlocked ? 'OPEN' : 'LOCKED'} /> }
          ]} 
          onAdd={() => handleOpenAdd('olt')} 
          onEdit={(item) => handleOpenEdit('olt', item)}
        />
      );
      case 'services': return <ServicesView />;
      case 'checklist': return <ChecklistView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 w-1.5 h-8 rounded-full"></div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab.toUpperCase()} — {activeClient.name}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
               <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all"><Bell size={20} /></button>
             </div>
             <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
             <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl shadow-lg shadow-slate-900/10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Acesso Sênior</span>
                  <span className="text-xs font-bold text-white">Auditor Técnico</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white"><Users size={16} /></div>
             </div>
          </div>
        </header>
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </div>
        <GenericModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={editingItem ? `Ajustar Registro: ${modalType}` : `Novo Registro: ${modalType}`}
          onSave={handleSave}
        >
          <div className="space-y-6">
             <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-[11px] text-indigo-900 leading-relaxed font-medium">
               <div className="flex items-center gap-2 mb-1">
                 <Settings size={14} className="text-indigo-600" />
                 <strong className="uppercase tracking-tighter">Nota de Integridade Arquitetural</strong>
               </div>
               A interface de Dashboard (React) utiliza dados otimizados para visualização. Para alterações de baixo nível no banco de dados operacional, utilize o portal de gestão técnica (SSR Wiki).
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Identificação Primária</label>
                  <input type="text" placeholder="Ex: POP-SPO-01" className="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Estado Operacional</label>
                  <select className="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    <option>Ativo / Produção</option>
                    <option>Em Implantação</option>
                    <option>Laboratório / Teste</option>
                    <option>Inativo</option>
                  </select>
               </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Notas de Documentação</label>
                <textarea className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 min-h-[120px]" placeholder="Descreva detalhes de topologia, VLANs de gerência ou contratos..."></textarea>
             </div>
          </div>
        </GenericModal>
      </main>
    </div>
  );
};

export default App;
