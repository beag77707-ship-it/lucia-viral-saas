import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Inicializar el cliente. El placeholder evita errores durante el build (compilación)
// si las variables de entorno aún no están configuradas en Vercel.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
