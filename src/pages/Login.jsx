import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') await register(name, password)
      else await login(name, password)
      // AuthProvider atualiza user -> App redireciona.
    } catch (err) {
      setError(err.message || 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-2xl font-extrabold text-white">
            R
          </span>
          <h1 className="text-2xl font-bold">Resenha Aposta</h1>
          <p className="text-sm text-muted">Entre com seu nome e senha</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-center text-sm text-warning">
            Supabase nao configurado (.env).
          </div>
        )}

        <form onSubmit={submit} className="card space-y-4 p-6">
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <div>
            <label className="label">Nome</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'signup' ? 'Cadastrar e entrar' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-muted">
            {mode === 'login' ? 'Nao tem conta?' : 'Ja tem conta?'}{' '}
            <button
              type="button"
              className="font-semibold text-brand-light hover:underline"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
              }}
            >
              {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
