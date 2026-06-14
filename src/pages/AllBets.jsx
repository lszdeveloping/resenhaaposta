import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Loading, Empty, ErrorBanner, PageHeader, StatusBadge } from '../components/ui'
import { listAllBets } from '../api/bets'
import { brl, formatDate, potentialReturn, betProfit } from '../lib/format'

export default function AllBets() {
  const { user } = useAuth()
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    listAllBets()
      .then(setBets)
      .catch((e) => setError(e.message || 'Erro ao carregar apostas'))
      .finally(() => setLoading(false))
  }, [])

  // Lista de usuarios para o filtro (distintos).
  const users = useMemo(() => {
    const map = new Map()
    bets.forEach((b) => b.user && map.set(b.user.id, b.user.name))
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]))
  }, [bets])

  const filtered = useMemo(
    () =>
      bets.filter(
        (b) =>
          (!userFilter || b.user?.id === userFilter) &&
          (!statusFilter || b.status === statusFilter),
      ),
    [bets, userFilter, statusFilter],
  )

  return (
    <div>
      <PageHeader title="Apostas dos amigos" subtitle="Veja as apostas de todos os usuarios" />
      <ErrorBanner message={error} />

      <div className="card mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        <div>
          <label className="label">Usuario</label>
          <select className="input" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="">Todos</option>
            {users.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="ganhou">Ganhou</option>
            <option value="perdeu">Perdeu</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Empty title="Nenhuma aposta encontrada" sub="Ajuste os filtros acima." />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const profit = betProfit(b)
            const mine = b.user?.id === user.id
            return (
              <div key={b.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-brand-light">
                        {b.user?.name || 'Desconhecido'}
                        {mine && <span className="ml-1 text-xs text-muted">(voce)</span>}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-slate-200">{b.title || 'Aposta'}</p>
                    <p className="text-xs text-muted">{formatDate(b.bet_date)}</p>
                  </div>
                  <div className="text-right">
                    {b.status !== 'pendente' && (
                      <span className={`font-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {(profit >= 0 ? '+' : '') + brl(profit)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
                  <Info label="Valor" value={brl(b.stake)} />
                  <Info label="Odd" value={`${Number(b.odd).toFixed(2)}x`} />
                  <Info label="Retorno" value={brl(potentialReturn(b.stake, b.odd))} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
