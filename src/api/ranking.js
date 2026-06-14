import { supabase } from '../lib/supabase'

// Le a view 'ranking' e ordena por lucro desc.
export async function getRanking() {
  const { data, error } = await supabase.from('ranking').select('*')
  if (error) throw error
  return [...data].sort((a, b) => Number(b.profit) - Number(a.profit))
}
