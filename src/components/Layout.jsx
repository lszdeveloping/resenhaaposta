import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block border-r border-line bg-bg-soft">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Sidebar mobile (drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-line bg-bg-soft">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Topbar mobile */}
        <header className="flex items-center gap-3 border-b border-line bg-bg-soft px-4 py-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-line p-2 text-slate-200"
            aria-label="Abrir menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-bold">Resenha Aposta</span>
        </header>

        {!isSupabaseConfigured && (
          <div className="border-b border-warning/40 bg-warning/10 px-4 py-2.5 text-center text-sm text-warning">
            Supabase nao configurado. Crie um arquivo <code>.env</code> (veja <code>.env.example</code>) e reinicie o servidor.
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
