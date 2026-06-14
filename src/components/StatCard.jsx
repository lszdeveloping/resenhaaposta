export default function StatCard({ title, value, sub, icon: Icon, accent = 'brand' }) {
  const accents = {
    brand: 'text-brand-light bg-brand/10',
    success: 'text-success bg-success/10',
    danger: 'text-danger bg-danger/10',
    warning: 'text-warning bg-warning/10',
    muted: 'text-muted bg-slate-500/10',
  }
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold truncate">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted truncate">{sub}</p>}
        </div>
        {Icon && (
          <span className={`shrink-0 rounded-lg p-2 ${accents[accent] || accents.brand}`}>
            <Icon width={22} height={22} />
          </span>
        )}
      </div>
    </div>
  )
}
