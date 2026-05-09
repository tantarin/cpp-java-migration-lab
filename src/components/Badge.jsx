const colors = {
  orange: { text: '#d29922', bg: 'rgba(210, 153, 34, 0.1)', border: 'rgba(210, 153, 34, 0.3)' },
  red: { text: '#f0883e', bg: 'rgba(240, 136, 62, 0.1)', border: 'rgba(240, 136, 62, 0.3)' },
  green: { text: '#3fb950', bg: 'rgba(63, 185, 80, 0.1)', border: 'rgba(63, 185, 80, 0.3)' },
  blue: { text: '#58a6ff', bg: 'rgba(88, 166, 255, 0.1)', border: 'rgba(88, 166, 255, 0.3)' },
  purple: { text: '#bc8cff', bg: 'rgba(188, 140, 255, 0.1)', border: 'rgba(188, 140, 255, 0.3)' },
  gray: { text: '#8b949e', bg: 'rgba(139, 148, 158, 0.1)', border: 'rgba(139, 148, 158, 0.3)' },
}

export default function Badge({ label, color = 'blue' }) {
  const c = colors[color] || colors.blue
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 600,
      fontFamily: 'JetBrains Mono',
      color: c.text,
      background: c.bg,
      border: `1px solid ${c.border}`,
      padding: '2px 10px',
      borderRadius: '4px',
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}
