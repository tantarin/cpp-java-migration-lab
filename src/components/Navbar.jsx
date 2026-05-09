import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/gym', label: 'Reading Gym', icon: '◈' },
    { to: '/case', label: 'Migration Case', icon: '◎' },
  ]

  return (
    <nav style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-primary)',
        }}>
          <span style={{ color: 'var(--cpp-color)' }}>C++</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>&rarr;</span>
          <span style={{ color: 'var(--java-color)' }}>Java</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> Lab</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '4px' }}>
        {links.map(({ to, label, icon }) => {
          const isActive = pathname.startsWith(to)
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(88, 166, 255, 0.3)' : 'transparent'}`,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontFamily: 'JetBrains Mono' }}>{icon}</span>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
