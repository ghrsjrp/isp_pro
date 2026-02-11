
export type Status = 'Ativo' | 'Inativo' | 'Pendente' | 'Em Implantação';

export interface ISPClient {
  id: string;
  name: string;
  cnpj: string;
  subscribers: number;
  erp: string;
  topology: 'Estrela' | 'Anel' | 'Mista';
  techContact: string;
  services: string[]; // Link, DDoS, Consultoria, etc.
  svas: string[];
  notes: string;
}

export interface Connectivity {
  id: string;
  type: 'Trânsito' | 'Transporte' | 'CDN' | 'PTT' | 'Peering';
  provider: string;
  asn?: string;
  capacity: string;
  interface: string;
  status: Status;
  vlan?: string;
}

export interface Router {
  id: string;
  hostname: string;
  model: string;
  version: string;
  lldp: boolean;
  bgpFilters: boolean;
  function: 'Borda' | 'BNG' | 'Core' | 'Borda/BNG';
  virtualSystem: boolean;
  antispoofing: boolean;
  firewallAcls: boolean;
  backup: boolean;
}

export interface Switch {
  id: string;
  hostname: string;
  model: string;
  version: string;
  capabilities: ('L2' | 'L3' | 'OSPF' | 'MPLS' | 'TE')[];
  lldp: boolean;
  stp: boolean;
  backup: boolean;
}

export interface OLT {
  id: string;
  hostname: string;
  model: string;
  version: string;
  cardsCount: number;
  ponPorts: number;
  subscribers: number;
  unlocked: boolean;
  backup: boolean;
}

export interface CoreServices {
  dns: {
    type: 'Anycast' | 'Unicast';
    version: string;
    routing: 'Static' | 'BGP' | 'OSPF';
    mode: 'Autoritativo' | 'Recursivo' | 'Ambos';
    zones: string[];
  };
  ntp: {
    localServer: boolean;
    status: string;
  };
  tools: {
    netflow: string; 
    ipam: string;    
    syslog: string;  
    backup: string;  
    monitoring: string[]; 
    irr: boolean;
    rpki: boolean;
    radius: string;
  };
  cgnat: {
    version: string;
    publicPool: string;
    privatePool: string;
  };
}

export interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  aiReasoning?: string;
}

export interface AuditResult {
  score: number;
  criticalIssues: number;
  summary: string;
  tasks: ChecklistItem[];
}
