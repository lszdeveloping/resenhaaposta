import { supabase } from './supabase'

// Hash SHA-256 (hex) via Web Crypto. Disponivel em https e em localhost.
export async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const SESSION_KEY = 'resenha.user'

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Cadastro: cria usuario se o nome ainda nao existe.
export async function signUp(name, password) {
  const clean = name.trim()
  if (!clean) throw new Error('Informe um nome.')
  if (!password || password.length < 4) throw new Error('Senha deve ter ao menos 4 caracteres.')

  const { data: existing } = await supabase
    .from('app_users')
    .select('id')
    .ilike('name', clean)
    .maybeSingle()
  if (existing) throw new Error('Ja existe um usuario com esse nome. Faca login.')

  const password_hash = await hashPassword(password)
  const { data, error } = await supabase
    .from('app_users')
    .insert({ name: clean, password_hash })
    .select('id, name')
    .single()
  if (error) throw new Error(error.message)

  const user = { id: data.id, name: data.name }
  saveSession(user)
  return user
}

// Login: confere nome + hash da senha.
export async function signIn(name, password) {
  const clean = name.trim()
  const { data, error } = await supabase
    .from('app_users')
    .select('id, name, password_hash')
    .ilike('name', clean)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Usuario nao encontrado. Cadastre-se.')

  const password_hash = await hashPassword(password)
  if (password_hash !== data.password_hash) throw new Error('Senha incorreta.')

  const user = { id: data.id, name: data.name }
  saveSession(user)
  return user
}
