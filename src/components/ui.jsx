import { STATUS_LABELS, STATUS_STYLES } from '../lib/format'

// Spinner de carregamento centralizado.
export function Loading({ label = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  )
}

// Estado vazio.
export function Empty({ title = 'Nada por aqui', sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {sub && <p className="text-sm text-muted">{sub}</p>}
      {action}
    </div>
  )
}

// Banner de erro.
export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  )
}

// Cabecalho de pagina com acao opcional.
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// Badge de status de aposta.
export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
