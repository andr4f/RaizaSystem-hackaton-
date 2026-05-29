import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home, Package, Route, BadgeCheck, QrCode,
  Users, BarChart3, Wallet, MapPin, Bell, ChevronDown, LogOut, Menu,
} from 'lucide-react'
import { useAuth } from '../../../app/providers/AuthContext'
import { useProducerData } from './useProducerData'
import impactImg from '../../../assets/imagen-prductor-modulo-3.jpg'
import './ProducerLayout.css'

const NAV = [
  { to: '/dashboard/producer',                end: true, icon: Home,      label: 'Inicio' },
  { to: '/dashboard/producer/lotes',          icon: Package,   label: 'Mis lotes' },
  { to: '/dashboard/producer/trazabilidad',   icon: Route,     label: 'Trazabilidad' },
  { to: '/dashboard/producer/certificaciones',icon: BadgeCheck,label: 'Certificaciones' },
  { to: '/dashboard/producer/qr',             icon: QrCode,    label: 'QR y etiquetas' },
  { to: '/dashboard/producer/leads',          icon: Users,     label: 'Leads y oportunidades' },
  { to: '/dashboard/producer/reportes',       icon: BarChart3, label: 'Reportes' },
  { to: '/dashboard/producer/finanzas',       icon: Wallet,    label: 'Finanzas' },
]

const ProducerLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { lots, producer, stats } = useProducerData()
  const [menuOpen, setMenuOpen] = useState(false)

  const activeLots = stats?.activeLots ?? lots.filter(l => ['AVAILABLE', 'CERTIFICATION_PENDING', 'RESERVED'].includes(l.status)).length
  const qrScans = stats?.qrScansThisMonth ?? stats?.qrScans ?? 0
  const location = producer?.municipality
    ? `${producer.municipality}${producer.department ? ', ' + producer.department : ''}`
    : 'Sierra Nevada de Santa Marta'

  const handleLogout = () => { logout(); navigate('/login') }
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="pl-shell">

      {menuOpen && (
        <button
          type="button"
          className="pl-sidebar-backdrop pl-sidebar-backdrop--visible"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`pl-sidebar${menuOpen ? ' pl-sidebar--open' : ''}`}>
        <div className="pl-brand">
          <img src="/logo-nombre.svg" alt="Raíza" className="pl-logo" />
          <span className="pl-tagline">Traza lo que nos conecta</span>
        </div>

        <nav className="pl-nav">
          {NAV.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) => `pl-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Card impacto */}
        <div className="pl-impact">
          <img src={impactImg} alt="" className="pl-impact-img" />
          <div className="pl-impact-overlay">
            <span className="pl-impact-title">🌱 Impacto de tu trabajo</span>
            <p className="pl-impact-text">Vas por buen camino, sigue conectando valor al territorio.</p>
            <div className="pl-impact-stats">
              <div>
                <strong>{activeLots}</strong>
                <span>Lotes activos</span>
              </div>
              <div>
                <strong>{qrScans}</strong>
                <span>Escaneos este mes</span>
              </div>
            </div>
            <button className="pl-impact-btn" onClick={() => navigate('/dashboard/producer/reportes')}>
              Ver mi impacto
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="pl-main">
        <header className="pl-topbar">
          <button
            type="button"
            className="pl-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="pl-location">
            <MapPin size={14} strokeWidth={2} />
            <span>{location}</span>
          </div>
          <div className="pl-topbar-right">
            <button className="pl-bell" aria-label="Notificaciones">
              <Bell size={18} strokeWidth={1.8} />
              <span className="pl-bell-dot" />
            </button>
            <div className="pl-user">
              <div className="pl-avatar">{(user?.name || 'P').charAt(0).toUpperCase()}</div>
              <div className="pl-user-info">
                <span className="pl-user-name">{user?.name || 'Productor'}</span>
                <span className="pl-user-role">Productor</span>
              </div>
              <ChevronDown size={15} className="pl-user-chev" />
              <button className="pl-logout" onClick={handleLogout} title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="pl-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ProducerLayout
