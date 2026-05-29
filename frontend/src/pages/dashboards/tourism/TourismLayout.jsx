import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home, Compass, Users, QrCode, CalendarCheck,
  Inbox, BarChart3, Wallet, Settings, MapPin, Bell, ChevronDown, LogOut, Menu,
} from 'lucide-react'
import { useAuth } from '../../../app/providers/AuthContext'
import { useTourismData } from './useTourismData'
import impactImg from '../../../assets/imagen-modulo-tres-agenciaTursimo.png'
import './TourismLayout.css'

const NAV = [
  { to: '/dashboard/tourism',                end: true, icon: Home,          label: 'Inicio' },
  { to: '/dashboard/tourism/experiencias',   icon: Compass,       label: 'Experiencias' },
  { to: '/dashboard/tourism/aliados',        icon: Users,         label: 'Productores aliados' },
  { to: '/dashboard/tourism/qr',             icon: QrCode,        label: 'QR turísticos' },
  { to: '/dashboard/tourism/reservas',       icon: CalendarCheck, label: 'Reservas y visitantes' },
  { to: '/dashboard/tourism/leads',          icon: Inbox,         label: 'Leads y solicitudes' },
  { to: '/dashboard/tourism/reportes',       icon: BarChart3,     label: 'Reportes' },
  { to: '/dashboard/tourism/finanzas',       icon: Wallet,        label: 'Finanzas' },
]

const TourismLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { operator, experiences, stats } = useTourismData()
  const [menuOpen, setMenuOpen] = useState(false)

  const visits = stats?.visitsThisMonth ?? stats?.visits ?? 0

  const location = operator?.municipality
    ? `${operator.municipality}, Magdalena`
    : 'Sierra Nevada de Santa Marta'

  const handleLogout = () => { logout(); navigate('/login') }
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="tl-shell">

      {menuOpen && (
        <button
          type="button"
          className="tl-sidebar-backdrop tl-sidebar-backdrop--visible"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`tl-sidebar${menuOpen ? ' tl-sidebar--open' : ''}`}>
        <div className="tl-brand">
          <img src="/logo-nombre.svg" alt="Raíza" className="tl-logo" />
          <span className="tl-tagline">Traza lo que nos conecta</span>
        </div>

        <nav className="tl-nav">
          {NAV.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) => `tl-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="tl-settings" onClick={() => navigate('/dashboard/tourism')}>
          <Settings size={18} strokeWidth={1.8} />
          <span>Configuración</span>
        </button>

        {/* Card impacto */}
        <div className="tl-impact" onClick={() => navigate('/dashboard/tourism/reportes')}>
          <img src={impactImg} alt="" className="tl-impact-img" />
          <div className="tl-impact-overlay">
            <span className="tl-impact-title">Conecta personas con historias auténticas del Magdalena</span>
            <div className="tl-impact-stats">
              <div>
                <strong>{experiences.length}</strong>
                <span>Experiencias activas</span>
              </div>
              <div>
                <strong>{visits}</strong>
                <span>Visitas este mes</span>
              </div>
            </div>
            <button className="tl-impact-btn">Ver mi impacto</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="tl-main">
        <header className="tl-topbar">
          <button
            type="button"
            className="tl-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="tl-location">
            <MapPin size={14} strokeWidth={2} />
            <span>{location}</span>
          </div>
          <div className="tl-topbar-right">
            <button className="tl-bell" aria-label="Notificaciones">
              <Bell size={18} strokeWidth={1.8} />
              <span className="tl-bell-dot" />
            </button>
            <div className="tl-user">
              <div className="tl-avatar">{(user?.name || 'O').charAt(0).toUpperCase()}</div>
              <div className="tl-user-info">
                <span className="tl-user-name">{operator?.contactName || user?.name || 'Operador'}</span>
                <span className="tl-user-role">Operador turístico</span>
              </div>
              <ChevronDown size={15} className="tl-user-chev" />
              <button className="tl-logout" onClick={handleLogout} title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="tl-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default TourismLayout
