import { useAuth } from '../../app/providers/AuthContext'
import { useNavigate } from 'react-router-dom'
import './DashboardLayout.css'

const DashboardLayout = ({ children, navItems, roleLabel }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">Raiza</span>
          <span className="sidebar-role">{roleLabel}</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item${item.active ? ' active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="user-name">{user?.name || user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
