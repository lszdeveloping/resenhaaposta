import { supabase } from '../lib/supabase'

// Apostas de um usuario (mais recentes primeiro).
export async function listMyBets(userId) {
  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('user_id', userId)
    .order('bet_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// payload: { user_id, title, description, bet_date, stake, odd, status }
export async function createBet(payload) {
  const { data, error } = await supabase
    .from('bets')
    .insert({
      ...payload,
      stake: Number(payload.stake) || 0,
      odd: Number(payload.odd) || 1,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBet(id, patch) {
  const clean = { ...patch }
  if (clean.stake != null) clean.stake = Number(clean.stake) || 0
  if (clean.odd != null) clean.odd = Number(clean.odd) || 1
  const { data, error } = await supabase
    .from('bets')
    .update(clean)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setBetStatus(id, status) {
  return updateBet(id, { status })
}

export async function deleteBet(id) {
  const { error } = await supabase.from('bets').delete().eq('id', id)
  if (error) throw error
}
