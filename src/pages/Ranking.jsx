import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Loading, Empty, ErrorBanner, PageHeader } from '../components/ui'
import { getRanking } from '../api/ranking'
import { brl } from '../lib/format'

export default function Ranking() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRanking()
      .then(setRows)
      .catch((e) => setError(e.message || 'Erro ao carregar ranking'))
      .finally(() => setLoading(false))
  }, [])

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}º`)

  return (
    <div>
      <PageHeader title="Ranking" subtitle="Ordenado pelo maior lucro" />
      <ErrorBanner message={error} />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty title="Sem dados" sub="Registre apostas para aparecer no ranking." />
      ) : (
        <>
          {/* Cards (mobile-friendly, estilo "fulano apostou X, perdeu Y, lucrou Z") */}
          <div className="space-y-3 lg:hidden">
            {rows.map((r, i) => {
              const profit = Number(r.profit)
              const mine = r.id === user.id
              return (
                <div key={r.id} className={`card p-4 ${mine ? 'border-brand/60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{medal(i)} {r.name}{mine && <span className="ml-1 text-xs text-brand-light">(voce)</span>}</p>
                    <span className={`font-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>{brl(profit)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Apostou <span className="text-slate-100">{brl(r.total_staked)}</span>,
                    perdeu <span className="text-danger">{brl(r.total_lost)}</span>,
                    {profit >= 0 ? ' lucrou ' : ' prejuizo de '}
                    <span className={profit >= 0 ? 'text-success' : 'text-danger'}>{brl(Math.abs(profit))}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{r.bets_won}V · {r.bets_lost}D · {r.bets_pending} pendente(s)</p>
                </div>
              )
            })}
          </div>

          {/* Tabela (desktop) */}
          <div className="hidden lg:block">
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-bg-soft text-left text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3 text-right">Apostado</th>
                    <th className="px-4 py-3 text-right">Perdido</th>
                    <th className="px-4 py-3 text-right">Lucro</th>
                    <th className="px-4 py-3 text-center">V</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">Pend.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((r, i) => {
                    const profit = Number(r.profit)
                    const mine = r.id === user.id
                    return (
                      <tr key={r.id} className={`hover:bg-bg-hover/50 ${mine ? 'bg-brand/5' : ''}`}>
                        <td className="px-4 py-3 font-semibold">{medal(i)}</td>
                        <td className="px-4 py-3 font-medium">{r.name}{mine && <span className="ml-1 text-xs text-brand-light">(voce)</span>}</td>
                        <td className="px-4 py-3 text-right">{brl(r.total_staked)}</td>
                        <td className="px-4 py-3 text-right text-danger">{brl(r.total_lost)}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${profit > 0 ? 'text-success' : profit < 0 ? 'text-danger' : ''}`}>{brl(profit)}</td>
                        <td className="px-4 py-3 text-center">{r.bets_won}</td>
                        <td className="px-4 py-3 text-center">{r.bets_lost}</td>
                        <td className="px-4 py-3 text-center text-muted">{r.bets_pending}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
