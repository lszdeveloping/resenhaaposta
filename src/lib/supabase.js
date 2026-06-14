import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Flag usada pela UI para avisar quando o app nao foi configurado.
export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // Nao quebra o app; paginas exibem aviso de configuracao.
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes. ' +
      'Crie um arquivo .env (veja .env.example).',
  )
}

export const supabase = createClient(
  url || 'http://localhost',
  anonKey || 'public-anon-key',
)
