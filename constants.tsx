
import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Cpu,
  Zap,
  Box,
  ShieldCheck,
  ClipboardCheck,
  Users
} from 'lucide-react';
import { ISPClient, Connectivity, Router, Switch, OLT, CoreServices, ChecklistItem, Peer, InternalLink, Hardware, VM } from './types.ts';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard size={18}/> },
  { id: 'isp-info', label: 'Dados do Cliente', icon: <Users size={18}/> },
  { id: 'connectivity', label: 'Conectividade', icon: <Globe size={18}/> },
  { id: 'routers', label: 'Roteadores', icon: <Cpu size={18}/> },
  { id: 'switches', label: 'Switches', icon: <Zap size={18}/> },
  { id: 'olts', label: 'OLTs', icon: <Box size={18}/> },
  { id: 'services', label: 'Serviços Core', icon: <ShieldCheck size={18}/> },
  { id: 'checklist', label: 'Checklist', icon: <ClipboardCheck size={18}/> },
];

export const MOCK_CLIENTS: ISPClient[] = [
  {
    id: '1',
    name: "Openx Telecom",
    cnpj: "04.305.299/0001-43",
    subscribers: 12500,
    erp: "IXC Soft",
    topology: "Anel",
    techContact: "Renato Ornelas",
    services: ["Trânsito IP", "DDoS Protect"],
    svas: ["Netflix"],
    notes: "Foco em expansão fibra."
  }
];

export const MOCK_CONNECTIVITY: Connectivity[] = [
  { id: 'c1', type: 'Trânsito', provider: 'Lumen', capacity: '10G', interface: 'Eth1/1', status: 'Ativo' }
];

export const MOCK_ROUTERS: Router[] = [
  { id: 'r1', hostname: 'BORDA-01', model: 'Huawei NE20E', version: 'V800', lldp: true, bgpFilters: true, function: 'Borda/BNG', virtualSystem: false, antispoofing: true, firewallAcls: true, backup: true }
];

export const MOCK_SWITCHES: Switch[] = [
  { id: 's1', hostname: 'SW-CORE-01', model: 'Datacom 4370', version: '2.4', capabilities: ['L3'], lldp: true, stp: true, backup: true }
];

export const MOCK_OLTS: OLT[] = [
  { id: 'o1', hostname: 'OLT-01', model: 'Fiberhome', version: 'RP12', cardsCount: 4, ponPorts: 64, subscribers: 2500, unlocked: true, backup: true }
];

export const MOCK_SERVICES: CoreServices = {
  dns: { type: 'Anycast', version: 'BIND9', routing: 'BGP', mode: 'Ambos', zones: ['openx.net.br'] },
  ntp: { localServer: true, status: 'Sincronizado' },
  tools: { netflow: 'Akvorado', ipam: 'phpIPAM', syslog: 'Graylog', backup: 'Cbackup', monitoring: ['Zabbix'], irr: true, rpki: true, radius: 'FreeRadius' },
  cgnat: { version: 'PBA', publicPool: '177.91.160.0/24', privatePool: '100.64.0.0/10' }
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', category: 'Segurança', task: 'Implementar RPKI Validation', completed: true, priority: 'High' }
];

export const ISP_DATA = {
  name: "Openx Consulting",
  cnpj: "04.305.299/0001-43",
  asn: "263444",
  ipv4: ["177.91.160.0/22"],
  techContact: "Renato Ornelas",
  activeServices: ["Trânsito IP"]
};

export const GROWTH_DATA = [
  { month: 'Jan', clients: 8200 },
  { month: 'Jun', clients: 10250 },
];

/**
 * Mock BGP Peers for NetworkView
 */
export const MOCK_PEERS: Peer[] = [
  {
    pop: 'SPO-01',
    localIp: '177.91.160.1',
    neighbor: 'Lumen',
    asn: '3356',
    type: 'Transit',
    bfd: true,
    status: 'UP',
    remoteIp: '177.91.160.2',
    circuitId: 'CIR-9988-LMN'
  },
  {
    pop: 'SPO-01',
    localIp: '177.91.160.5',
    neighbor: 'IX.br SP',
    asn: '26162',
    type: 'PTT',
    bfd: false,
    status: 'UP',
    remoteIp: '187.16.192.1',
    circuitId: 'PTT-SP-001'
  }
];

/**
 * Mock Internal Links for NetworkView
 */
export const MOCK_INTERNAL_LINKS: InternalLink[] = [
  {
    localSwitch: 'SW-CORE-01',
    remoteSwitch: 'SW-AGG-01',
    localIp: '10.255.0.1/30',
    vlan: '100',
    protocol: 'OSPF',
    bfd: true,
    mtu: '9000',
    status: 'UP'
  }
];

/**
 * Mock Hardware for InfrastructureView
 */
export const MOCK_HARDWARE: Hardware[] = [
  {
    hostname: 'HV-PROD-01',
    managementIp: '10.10.10.11',
    model: 'Dell R740',
    resources: '2x Xeon Gold, 256GB RAM',
    hypervisor: 'Proxmox 8.1',
    raid: 'ZFS Raid10',
    warranty: 'JAN/2026',
    location: 'Rack 04 - DC SPO'
  },
  {
    hostname: 'HV-PROD-02',
    managementIp: '10.10.10.12',
    model: 'Dell R740',
    resources: '2x Xeon Gold, 256GB RAM',
    hypervisor: 'Proxmox 8.1',
    raid: 'ZFS Raid10',
    warranty: 'JAN/2026',
    location: 'Rack 04 - DC SPO'
  }
];

/**
 * Mock VMs for InfrastructureView
 */
export const MOCK_VMS: VM[] = [
  {
    name: 'DNS-REC-01',
    internalIp: '177.91.160.10',
    service: 'DNS Recursivo',
    host: 'HV-PROD-01',
    resources: '4 vCPU, 8GB RAM',
    os: 'Debian 12',
    backup: 'DIÁRIO',
    status: 'UP'
  },
  {
    name: 'ZABBIX-SRV',
    internalIp: '10.10.10.50',
    service: 'Monitoramento',
    host: 'HV-PROD-02',
    resources: '8 vCPU, 16GB RAM',
    os: 'Ubuntu 22.04',
    backup: 'DIÁRIO',
    status: 'UP'
  }
];
