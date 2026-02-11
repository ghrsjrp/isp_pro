
-- Execute este SQL no editor de SQL do Supabase para criar a estrutura

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT,
  subscribers INTEGER DEFAULT 0,
  erp TEXT,
  topology TEXT,
  tech_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE connectivity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  type TEXT,
  provider TEXT,
  capacity TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE routers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  hostname TEXT,
  model TEXT,
  function TEXT,
  backup BOOLEAN DEFAULT true,
  bgp_filters BOOLEAN DEFAULT true
);

-- Adicione RLS (Row Level Security) conforme necessário no painel Supabase
