
import React from 'react';
import { MOCK_HARDWARE, MOCK_VMS } from '../constants';
import StatusBadge from './StatusBadge';
import { HardDrive, Cpu, Database, Activity } from 'lucide-react';

const InfrastructureView: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            <HardDrive className="text-blue-500" size={24}/>
            Hardware & Hypervisors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_HARDWARE.map((hw, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{hw.hostname}</h4>
                  <p className="text-sm text-slate-400 font-mono">{hw.managementIp}</p>
                </div>
                <StatusBadge status="UP" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Cpu size={16} className="text-slate-400" />
                  <span className="text-slate-600 font-medium">{hw.model}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Database size={16} className="text-slate-400" />
                  <span>{hw.resources}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Activity size={16} className="text-slate-400" />
                  <span>{hw.hypervisor} | {hw.raid}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Garantia: {hw.warranty}</span>
                <span className="text-slate-400">{hw.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Virtual Machines (Produção)</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">VM Name</th>
                <th className="px-6 py-4 font-bold text-slate-600">Serviço / Host</th>
                <th className="px-6 py-4 font-bold text-slate-600">Recursos</th>
                <th className="px-6 py-4 font-bold text-slate-600">Backup</th>
                <th className="px-6 py-4 font-bold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_VMS.map((vm, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{vm.name}</p>
                    <p className="text-xs text-slate-400 font-mono italic">{vm.internalIp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{vm.service}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase">Node: {vm.host}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {vm.resources} | {vm.os}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold uppercase">{vm.backup}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={vm.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InfrastructureView;
