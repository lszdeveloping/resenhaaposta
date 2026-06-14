import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import StatCard from '../components/StatCard'
import { Loading, Empty, ErrorBanner, PageHeader, StatusBadge } from '../components/ui'
import { IconPlus, IconEdit, IconTrash, IconMoney, IconTrendUp, IconClock } from '../components/Icons'
import { listMyBets, createBet, updateBet, setBetStatus, deleteBet } from '../api/bets'
import { brl, formatDate, todayISO, potentialReturn, betProfit } from '../lib/format'

const emptyForm = { title: '', stake: '', odd: '', bet_date: todayISO(), status: 'pendente' }

export default function MyBets() {
  const { user } = useAuth()
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setBets(await listMyBets(user.id))
    } catch (e) {
      setError(e.message || 'Erro ao carregar apostas')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load()
  }, [user.id])

  const summary = useMemo(() => {
    const staked = bets.reduce((s, b) => s + Number(b.stake || 0), 0)
    const profit = bets.reduce((s, b) => s + betProfit(b), 0)
    const pending = bets.filter((b) => b.status === 'pendente').length
    return { staked, profit, pending }
  }, [bets])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModal(true)
  }
  function openEdit(b) {
    setEditing(b)
    setForm({
      title: b.title || '',
      stake: b.stake ?? '',
      odd: b.odd ?? '',
      bet_date: b.bet_date || todayISO(),
      status: b.status,
    })
    setModal(true)
  }

  async function save(e) {
    e.preventDefault()
    if (!form.stake || Number(form.stake) <= 0) return setError('Informe o valor apostado.')
    if (!form.odd || Number(form.odd) <= 0) return setError('Informe a odd (ex.: 2.35).')
    setSaving(true)
    setError('')
    try {
      if (editing) await updateBet(editing.id, form)
      else await createBet({ ...form, user_id: user.id })
      setModal(false)
      await load()
    } catch (e) {
      setError(e.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(b, status) {
    try {
      await setBetStatus(b.id, status)
      await load()
    } catch (e) {
      setError(e.message || 'Erro ao atualizar status')
    }
  }

  async function remove(b) {
    if (!confirm('Excluir esta aposta?')) return
    try {
      await deleteBet(b.id)
      await load()
    } catch (e) {
      setError(e.message || 'Erro ao excluir')
    }
  }

  return (
    <div>
      <PageHeader
        title="Minhas apostas"
        subtitle={`Ola, ${user.name}`}
        action={
          <button className="btn-primary" onClick={openNew}>
            <IconPlus width={18} height={18} /> Nova aposta
          </button>
        }
      />
      <ErrorBanner message={error} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total apostado" value={brl(summary.staked)} icon={IconMoney} accent="brand" />
        <StatCard
          title="Lucro / Prejuizo"
          value={brl(summary.profit)}
          icon={IconTrendUp}
          accent={summary.profit >= 0 ? 'success' : 'danger'}
        />
        <StatCard title="Pendentes" value={summary.pending} icon={IconClock} accent="warning" />
      </div>

      {loading ? (
        <Loading />
      ) : bets.length === 0 ? (
        <Empty
          title="Nenhuma aposta ainda"
          sub="Registre sua primeira aposta (valor + odd)."
          action={
            <button className="btn-primary mt-2" onClick={openNew}>
              <IconPlus width={18} height={18} /> Nova aposta
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {bets.map((b) => {
            const profit = betProfit(b)
            return (
              <div key={b.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{b.title || 'Aposta'}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{formatDate(b.bet_date)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="rounded-lg p-2 text-muted hover:bg-bg-hover hover:text-brand-light" aria-label="Editar">
                      <IconEdit width={18} height={18} />
                    </button>
                    <button onClick={() => remove(b)} className="rounded-lg p-2 text-muted hover:bg-bg-hover hover:text-danger" aria-label="Excluir">
                      <IconTrash width={18} height={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Info label="Valor" value={brl(b.stake)} />
                  <Info label="Odd" value={`${Number(b.odd).toFixed(2)}x`} />
                  <Info label="Retorno" value={brl(potentialReturn(b.stake, b.odd))} />
                  <Info
                    label={b.status === 'pendente' ? 'Lucro potencial' : 'Resultado'}
                    value={
                      <span className={profit > 0 ? 'text-success' : profit < 0 ? 'text-danger' : ''}>
                        {b.status === 'pendente'
                          ? `+${brl(potentialReturn(b.stake, b.odd) - b.stake)}`
                          : (profit >= 0 ? '+' : '') + brl(profit)}
                      </span>
                    }
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                  <StatusButton active={b.status === 'ganhou'} tone="success" onClick={() => changeStatus(b, 'ganhou')}>
                    Ganhou
                  </StatusButton>
                  <StatusButton active={b.status === 'perdeu'} tone="danger" onClick={() => changeStatus(b, 'perdeu')}>
                    Perdeu
                  </StatusButton>
                  <StatusButton active={b.status === 'pendente'} tone="muted" onClick={() => changeStatus(b, 'pendente')}>
                    Pendente
                  </StatusButton>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar aposta' : 'Nova aposta'}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Titulo (opcional)</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex.: Flamengo x Vasco" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Valor apostado (R$) *</label>
              <input type="number" step="0.01" min="0" className="input" value={form.stake} onChange={(e) => setForm({ ...form, stake: e.target.value })} placeholder="0,00" />
            </div>
            <div>
              <label className="label">Odd *</label>
              <input type="number" step="0.01" min="1" className="input" value={form.odd} onChange={(e) => setForm({ ...form, odd: e.target.value })} placeholder="2.35" />
            </div>
          </div>

          {form.stake && form.odd && (
            <p className="rounded-lg bg-bg-soft px-3 py-2 text-sm text-muted">
              Retorno potencial: <span className="text-slate-100">{brl(potentialReturn(form.stake, form.odd))}</span>{' '}
              (lucro <span className="text-success">+{brl(potentialReturn(form.stake, form.odd) - Number(form.stake))}</span>)
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Data</label>
              <input type="date" className="input" value={form.bet_date} onChange={(e) => setForm({ ...form, bet_date: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pendente">Pendente</option>
                <option value="ganhou">Ganhou</option>
                <option value="perdeu">Perdeu</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </Modal>
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

function StatusButton({ active, tone, onClick, children }) {
  const tones = {
    success: active ? 'bg-success text-white' : 'text-success',
    danger: active ? 'bg-danger text-white' : 'text-danger',
    muted: active ? 'bg-slate-600 text-white' : 'text-muted',
  }
  return (
    <button onClick={onClick} className={`rounded-lg border border-line px-3 py-1.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </button>
  )
}
