import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconBets, IconRanking, IconFriends } from './Icons'

const links = [
  { to: '/', label: 'Minhas apostas', icon: IconBets, end: true },
  { to: '/apostas', label: 'Apostas dos amigos', icon: IconFriends },
  { to: '/ranking', label: 'Ranking', icon: IconRanking },
]

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-extrabold text-white">
          R
        </span>
        <div className="leading-tight">
          <p className="font-bold">Resenha Aposta</p>
          <p className="text-xs text-muted">Controle de apostas</p>
        </div>
      </div>

      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand/15 text-brand-light'
                : 'text-slate-300 hover:bg-bg-hover hover:text-white'
            }`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}

      <div className="mt-auto border-t border-line pt-3">
        <p className="px-3 text-xs text-muted">Conectado como</p>
        <p className="px-3 font-semibold">{user?.name}</p>
        <button
          onClick={logout}
          className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-bg-hover hover:text-danger"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
