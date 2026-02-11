
import React from 'react';
import { MOCK_PEERS, MOCK_INTERNAL_LINKS } from '../constants.tsx';
import StatusBadge from './StatusBadge.tsx';

const NetworkView: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Conectividade EGP (BGP External)</h3>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
                + Novo Peer
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">POP / Router</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Peer / ASN</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Tipo</th>
                  <th className="px-6 py-4 font-bold text-slate-600">BFD</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600">IP Remoto</th>
                  <th className="px-6 py-4 font-bold text-slate-600">N. Circuito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PEERS.map((peer, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{peer.pop}</p>
                      <p className="text-xs text-slate-400">Local: {peer.localIp}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{peer.neighbor}</p>
                      <p className="text-xs text-indigo-500 font-mono">AS{peer.asn}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{peer.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={peer.bfd ? 'SIM' : 'NAO'} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={peer.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{peer.remoteIp}</td>
                    <td className="px-6 py-4 text-slate-500 italic text-xs">{peer.circuitId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 text-slate-800">Conectividade IGP (OSPF / iBGP)</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Links Internos</th>
                  <th className="px-6 py-4 font-bold text-slate-600">VLAN / IP</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Protocolo</th>
                  <th className="px-6 py-4 font-bold text-slate-600">BFD</th>
                  <th className="px-6 py-4 font-bold text-slate-600">MTU</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_INTERNAL_LINKS.map((link, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{link.localSwitch}</span>
                        <span className="text-slate-300">→</span>
                        <span className="font-semibold text-slate-800">{link.remoteSwitch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-slate-500">{link.localIp}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">VLAN {link.vlan}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{link.protocol}</span>
                    </td>
                    <td className="px-6 py-4">
                       <StatusBadge status={link.bfd ? 'SIM' : 'NAO'} />
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">{link.mtu}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={link.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NetworkView;
