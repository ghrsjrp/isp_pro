
import { createClient } from '@supabase/supabase-js';

// Estas variáveis devem ser configuradas no seu ambiente Supabase
const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseKey = 'sua-chave-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
