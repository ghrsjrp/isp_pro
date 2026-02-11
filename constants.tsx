
import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Network, 
  HardDrive, 
  ShieldCheck, 
  ClipboardCheck, 
  Users,
  Cpu,
  Zap,
  Box
} from 'lucide-react';
import { ISPClient, Connectivity, Router, Switch, OLT, CoreServices, ChecklistItem } from './types';

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
    services: ["Trânsito IP", "DDoS Protect", "Consultoria BGP"],
    svas: ["Netflix", "Globoplay"],
    notes: "Cliente principal com foco em expansão fibra óptica."
  },
  {
    id: '2',
    name: "FiberNet Pro",
    cnpj: "12.345.678/0001-99",
    subscribers: 3200,
    erp: "MK Solutions",
    topology: "Estrela",
    techContact: "João Silva",
    services: ["Transporte", "Consultoria"],
    svas: [],
    notes: "Provedor local em fase de migração para BNG."
  }
];

export const MOCK_CONNECTIVITY: Connectivity[] = [
  { id: 'c1', type: 'Trânsito', provider: 'Lumen', asn: '3356', capacity: '10G', interface: 'Eth1/1', status: 'Ativo' },
  { id: 'c2', type: 'PTT', provider: 'IX.br SP', asn: '263444', capacity: '100G', interface: 'Eth1/2', status: 'Ativo' },
  { id: 'c3', type: 'CDN', provider: 'Google GGC', capacity: '20G', interface: 'Eth1/3', status: 'Ativo' }
];

export const MOCK_ROUTERS: Router[] = [
  {
    id: 'r1',
    hostname: 'BORDA-01-OPENX',
    model: 'Huawei NE20E-S2F',
    version: 'V800R012',
    lldp: true,
    bgpFilters: true,
    function: 'Borda/BNG',
    virtualSystem: false,
    antispoofing: true,
    firewallAcls: true,
    backup: true
  }
];

export const MOCK_SWITCHES: Switch[] = [
  {
    id: 's1',
    hostname: 'SW-DIST-01',
    model: 'Datacom DM4370',
    version: '2.4.1',
    capabilities: ['L2', 'L3', 'OSPF'],
    lldp: true,
    stp: true,
    backup: true
  }
];

export const MOCK_OLTS: OLT[] = [
  {
    id: 'o1',
    hostname: 'OLT-HEADEND-01',
    model: 'Fiberhome AN5516-01',
    version: 'RP1200',
    cardsCount: 4,
    ponPorts: 64,
    subscribers: 2500,
    unlocked: true,
    backup: true
  }
];

export const MOCK_SERVICES: CoreServices = {
  dns: {
    type: 'Anycast',
    version: 'BIND9',
    routing: 'BGP',
    mode: 'Ambos',
    zones: ['openx.net.br', 'cliente.openx.net.br']
  },
  ntp: {
    localServer: true,
    status: 'Sincronizado'
  },
  tools: {
    netflow: 'Akvorado',
    ipam: 'phpIPAM',
    syslog: 'Graylog',
    backup: 'Cbackup',
    monitoring: ['Zabbix', 'Grafana'],
    irr: true,
    rpki: true,
    radius: 'FreeRadius'
  },
  cgnat: {
    version: 'PBA (Deterministic)',
    publicPool: '177.91.160.0/24',
    privatePool: '100.64.0.0/10'
  }
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', category: 'Segurança', task: 'Implementar RPKI Validation', completed: true, priority: 'High' },
  { id: '2', category: 'Monitoramento', task: 'Configurar Grafana para CGNAT', completed: false, priority: 'Medium' },
  { id: '3', category: 'BGP', task: 'Revisar filtros BOGONS', completed: true, priority: 'High' }
];

// Added missing exports for Dashboard.tsx
export const ISP_DATA = {
  name: "Openx Consulting & Tech",
  cnpj: "04.305.299/0001-43",
  asn: "263444",
  ipv4: ["177.91.160.0/22", "189.45.128.0/24"],
  techContact: "Renato Ornelas - NOC Manager",
  activeServices: ["Trânsito IP", "PTT-IX", "DDoS Protect", "CGNAT Managed"]
};

// Added missing exports for Dashboard.tsx
export const GROWTH_DATA = [
  { month: 'Jan', clients: 8200 },
  { month: 'Fev', clients: 8500 },
  { month: 'Mar', clients: 8900 },
  { month: 'Abr', clients: 9400 },
  { month: 'Mai', clients: 9800 },
  { month: 'Jun', clients: 10250 },
];

// Added missing exports for NetworkView.tsx
export const MOCK_PEERS = [
  { pop: 'SPO-01', neighbor: 'LUMEN', asn: '3356', type: 'Trânsito', bfd: true, status: 'UP', localIp: '100.64.0.1', remoteIp: '100.64.0.2', circuitId: 'CRT-99822' },
  { pop: 'SPO-01', neighbor: 'IX.br SP', asn: '263444', type: 'PTT', bfd: false, status: 'UP', localIp: '187.16.0.44', remoteIp: '187.16.0.1', circuitId: 'VLAN-100' },
  { pop: 'SPO-01', neighbor: 'TELIA', asn: '1299', type: 'Trânsito', bfd: true, status: 'DOWN', localIp: '10.255.0.5', remoteIp: '10.255.0.6', circuitId: 'CRT-11223' },
];

// Added missing exports for NetworkView.tsx
export const MOCK_INTERNAL_LINKS = [
  { localSwitch: 'SW-CORE-01', remoteSwitch: 'SW-DIST-01', localIp: '10.0.0.1/30', vlan: '10', protocol: 'OSPF', bfd: true, mtu: '9000', status: 'UP' },
  { localSwitch: 'SW-CORE-01', remoteSwitch: 'SW-DIST-02', localIp: '10.0.0.5/30', vlan: '11', protocol: 'OSPF', bfd: true, mtu: '9000', status: 'UP' },
];

// Added missing exports for InfrastructureView.tsx
export const MOCK_HARDWARE = [
  { hostname: 'SRV-HV-01', model: 'Dell R740', managementIp: '10.20.0.11', resources: '2x Gold 6130 / 256GB RAM', hypervisor: 'Proxmox 8.1', raid: 'RAID 10 (SSD)', warranty: '2026-12', location: 'Rack 04 - DC SPO' },
  { hostname: 'SRV-HV-02', model: 'HP DL380 G10', managementIp: '10.20.0.12', resources: '2x Gold 5118 / 128GB RAM', hypervisor: 'Proxmox 8.1', raid: 'RAID 5 (SAS)', warranty: 'Expira em breve', location: 'Rack 04 - DC SPO' },
];

// Added missing exports for InfrastructureView.tsx
export const MOCK_VMS = [
  { name: 'VM-DNS-01', service: 'Recursive DNS', host: 'SRV-HV-01', resources: '4 vCPU / 8GB RAM', os: 'Debian 12', internalIp: '10.50.0.5', backup: 'Diário', status: 'UP' },
  { name: 'VM-ZABBIX', service: 'Monitoring', host: 'SRV-HV-02', resources: '8 vCPU / 16GB RAM', os: 'Ubuntu 22.04', internalIp: '10.50.0.10', backup: 'Semanal', status: 'UP' },
  { name: 'VM-CGNAT-LOG', service: 'Syslog/Netflow', host: 'SRV-HV-01', resources: '16 vCPU / 64GB RAM', os: 'Debian 12', internalIp: '10.50.0.20', backup: 'Nenhum', status: 'UP' },
];
