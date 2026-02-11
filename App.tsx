
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ClientManager from './components/ClientManager.tsx';
import ChecklistView from './components/ChecklistView.tsx';
import StatusBadge from './components/StatusBadge.tsx';
import GenericModal from './components/GenericModal.tsx';
import { CRUDTable } from './components/CRUDTable.tsx';
import NetworkView from './components/NetworkView.tsx';
import InfrastructureView from './components/InfrastructureView.tsx';
import SpreadsheetViewer from './components/SpreadsheetViewer.tsx';
import { Bell, Users, Settings } from 'lucide-react';
import { MOCK_CLIENTS, MOCK_CONNECTIVITY, MOCK_ROUTERS, MOCK_SWITCHES, MOCK_OLTS } from './constants.tsx';
import { ISPClient, Connectivity, Router, Switch, OLT } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeClientId, setActiveClientId] = useState(MOCK_CLIENTS[0].id);
  
  const [clients] = useState<ISPClient[]>(MOCK_CLIENTS);
  const [connectivity] = useState<Connectivity[]>(MOCK_CONNECTIVITY);
  const [routers] = useState<Router[]>(MOCK_ROUTERS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('none');
  const [editingItem, setEditingItem] = useState<any>(null);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const handleOpenAdd = (type: string) => {
    setEditingItem(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: string, item: any) => {
    setEditingItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    alert('Operação simulada. A persistência real ocorre no backend Docker/Postgres.');
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
               className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
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
      case 'connectivity': return <NetworkView />;
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
      case 'services': return <InfrastructureView />;
      case 'checklist': return <ChecklistView />;
      case 'import-spreadsheet': return <SpreadsheetViewer />;
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
             <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all"><Bell size={20} /></button>
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
               <strong>Nota de Integridade:</strong> A interface de Dashboard utiliza dados otimizados.
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Identificação Primária</label>
                  <input type="text" placeholder="Ex: POP-SPO-01" className="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Estado Operacional</label>
                  <select className="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    <option>Ativo / Produção</option>
                    <option>Em Implantação</option>
                    <option>Inativo</option>
                  </select>
               </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Notas de Documentação</label>
                <textarea className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[120px]" placeholder="Descreva detalhes técnicos..."></textarea>
             </div>
          </div>
        </GenericModal>
      </main>
    </div>
  );
};

export default App;
