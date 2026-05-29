import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home, Search, PackageCheck, BadgeCheck, TrendingUp,
  Users, Truck, BarChart3, Wallet, MapPin, Bell, ChevronDown, LogOut, Settings, Menu,
} from 'lucide-react'
import { useAuth } from '../../../app/providers/AuthContext'
import { useExporterData } from './useExporterData'
import './ExporterLayout.css'

const NAV = [
  { to: '/dashboard/exporter',                 end: true, icon: Home,         label: 'Inicio' },
  { to: '/dashboard/exporter/explorar',        icon: Search,       label: 'Explorar productos' },
  { to: '/dashboard/exporter/lotes',           icon: PackageCheck, label: 'Lotes verificados' },
  { to: '/dashboard/exporter/certificaciones', icon: BadgeCheck,   label: 'Certificaciones' },
  { to: '/dashboard/exporter/oportunidades',   icon: TrendingUp,   label: 'Oportunidades' },
  { to: '/dashboard/exporter/contactos',       icon: Users,        label: 'Contactos y productores' },
  { to: '/dashboard/exporter/ordenes',         icon: Truck,        label: 'Órdenes y envíos' },
  { to: '/dashboard/exporter/reportes',        icon: BarChart3,    label: 'Reportes' },
  { to: '/dashboard/exporter/finanzas',        icon: Wallet,       label: 'Finanzas' },
]

const ExporterLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { verifiedLots, leads } = useExporterData()
  const [menuOpen, setMenuOpen] = useState(false)

  const newLeads = leads.filter(l => ['NEW', 'CONTACTED'].includes(l.leadStatus)).length

  const handleLogout = () => { logout(); navigate('/login') }
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="el-shell">

      {menuOpen && (
        <button
          type="button"
          className="el-sidebar-backdrop el-sidebar-backdrop--visible"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`el-sidebar${menuOpen ? ' el-sidebar--open' : ''}`}>
        <div className="el-brand">
          <img src="/logo-nombre.svg" alt="Raíza" className="el-logo" />
          <span className="el-tagline">Traza lo que nos conecta</span>
        </div>

        <nav className="el-nav">
          {NAV.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) => `el-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="el-settings" onClick={() => navigate('/dashboard/exporter')}>
          <Settings size={18} strokeWidth={1.8} />
          <span>Configuración</span>
        </button>

        {/* Card lotes disponibles */}
        <div className="el-stockcard" onClick={() => navigate('/dashboard/exporter/lotes')}>
          <div className="el-stockcard-overlay">
            <span className="el-stockcard-label">Lotes disponibles</span>
            <strong className="el-stockcard-num">{verifiedLots.length}</strong>
            <span className="el-stockcard-leads">
              <span className="el-stockcard-dot" /> {newLeads} nuevos leads
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="el-main">
        <header className="el-topbar">
          <button
            type="button"
            className="el-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="el-location">
            <MapPin size={14} strokeWidth={2} />
            <span>Sierra Nevada de Santa Marta</span>
          </div>
          <div className="el-topbar-right">
            <button className="el-bell" aria-label="Notificaciones">
              <Bell size={18} strokeWidth={1.8} />
              <span className="el-bell-dot" />
            </button>
            <div className="el-user">
              <div className="el-avatar">{(user?.name || 'E').charAt(0).toUpperCase()}</div>
              <div className="el-user-info">
                <span className="el-user-name">{user?.name || 'Exportador'}</span>
                <span className="el-user-role">Exportador</span>
              </div>
              <ChevronDown size={15} className="el-user-chev" />
              <button className="el-logout" onClick={handleLogout} title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="el-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ExporterLayout
