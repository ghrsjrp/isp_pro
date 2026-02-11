
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ISP_DATA, GROWTH_DATA } from '../constants';
import { Globe, Users, Server, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'ASN Ativo', value: ISP_DATA.asn, icon: <Globe className="text-blue-500" />, trend: 'OK' },
    { label: 'Qtd Clientes', value: '10.0k+', icon: <Users className="text-emerald-500" />, trend: '+15%' },
    { label: 'Infra Hypervisors', value: '2 Nodes', icon: <Server className="text-purple-500" />, trend: 'Estável' },
    { label: 'Uptime Geral', value: '99.98%', icon: <Zap className="text-amber-500" />, trend: 'Crítico' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-slate-50">{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Crescimento de Base de Clientes</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorClients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Dados do ISP</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Razão Social</p>
              <p className="text-slate-700 font-semibold">{ISP_DATA.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">CNPJ</p>
              <p className="text-slate-700 font-semibold">{ISP_DATA.cnpj}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Prefixos IPv4</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {ISP_DATA.ipv4.map(ip => <span key={ip} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-lg text-xs font-mono">{ip}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Responsável Técnico</p>
              <p className="text-slate-700 font-semibold text-sm">{ISP_DATA.techContact}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Serviços Ativos</p>
                <div className="flex flex-wrap gap-2">
                    {ISP_DATA.activeServices.map(s => <span key={s} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold">{s}</span>)}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
