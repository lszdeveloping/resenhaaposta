// Helpers de formatacao e calculo.

export const brl = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

export const formatDate = (value) => {
  if (!value) return '-'
  // Aceita 'YYYY-MM-DD' (date) ou ISO completo.
  const d = typeof value === 'string' && value.length === 10
    ? new Date(value + 'T00:00:00')
    : new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('pt-BR')
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

// Taxa de vitoria em % (0-100).
export const winRate = (won, lost) => {
  const total = (won || 0) + (lost || 0)
  if (!total) return 0
  return Math.round(((won || 0) / total) * 100)
}

export const STATUS_LABELS = {
  pendente: 'Pendente',
  ganhou: 'Ganhou',
  perdeu: 'Perdeu',
}

export const STATUS_STYLES = {
  pendente: 'bg-warning/15 text-warning',
  ganhou: 'bg-success/15 text-success',
  perdeu: 'bg-danger/15 text-danger',
}

// Retorno potencial: stake * odd.
export const potentialReturn = (stake, odd) =>
  (Number(stake) || 0) * (Number(odd) || 0)

// Lucro liquido de uma aposta conforme status.
export const betProfit = (bet) => {
  const stake = Number(bet.stake) || 0
  const odd = Number(bet.odd) || 0
  if (bet.status === 'ganhou') return stake * odd - stake
  if (bet.status === 'perdeu') return -stake
  return 0
}
