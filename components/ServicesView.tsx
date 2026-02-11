
import React from 'react';
import { MOCK_SERVICES } from '../constants';
import { ShieldCheck, Server, Search, Globe, Activity, Lock } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ServicesView: React.FC = () => {
  const s = MOCK_SERVICES;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* DNS Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={24} /></div>
          <h3 className="text-xl font-bold text-slate-800">DNS & NTP</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">DNS Tipo</p>
              <p className="font-bold text-slate-700">{s.dns.type} ({s.dns.version})</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">NTP Local</p>
              <StatusBadge status={s.ntp.localServer ? 'SIM' : 'NAO'} />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-2">ZONAS AUTORITATIVAS</p>
            <div className="flex flex-wrap gap-2">
              {s.dns.zones.map(z => <span key={z} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-mono">{z}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Activity size={24} /></div>
          <h3 className="text-xl font-bold text-slate-800">Stack de Ferramentas</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            { label: 'Netflow', value: s.tools.netflow },
            { label: 'IPAM', value: s.tools.ipam },
            { label: 'Syslog', value: s.tools.syslog },
            { label: 'Backup Config', value: s.tools.backup },
            { label: 'Radius', value: s.tools.radius },
          ].map(tool => (
            <div key={tool.label} className="border-b border-slate-50 pb-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{tool.label}</p>
              <p className="text-sm font-semibold text-slate-700">{tool.value}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">RPKI / IRR</p>
            <div className="flex gap-2 mt-1">
              <StatusBadge status={s.tools.rpki ? 'RPKI ON' : 'RPKI OFF'} />
              <StatusBadge status={s.tools.irr ? 'IRR ON' : 'IRR OFF'} />
            </div>
          </div>
        </div>
      </div>

      {/* CGNAT Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Lock size={24} /></div>
          <h3 className="text-xl font-bold text-slate-800">CGNAT & Routing Pools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">VERSÃO/MODO</p>
            <p className="text-lg font-bold text-slate-800">{s.cgnat.version}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">POOL PÚBLICO</p>
            <p className="text-lg font-bold text-slate-800 font-mono">{s.cgnat.publicPool}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">POOL PRIVADO</p>
            <p className="text-lg font-bold text-slate-800 font-mono">{s.cgnat.privatePool}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
