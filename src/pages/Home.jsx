import { Link } from 'react-router-dom'

function FeatureCard({ to, title, subtitle, description, icon, color, items }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: `1px solid var(--border)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '10px',
        padding: '28px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = color
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.borderTopColor = color
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '24px',
            color,
          }}>{icon}</span>
        </div>
        <h2 style={{
          margin: '0 0 6px',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>{title}</h2>
        <p style={{
          margin: '0 0 16px',
          fontSize: '13px',
          fontFamily: 'JetBrains Mono',
          color,
        }}>{subtitle}</p>
        <p style={{
          margin: '0 0 20px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>{description}</p>
        <ul style={{
          margin: 0,
          padding: '0 0 0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {items.map((item, i) => (
            <li key={i} style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono',
            }}>{item}</li>
          ))}
        </ul>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      padding: '64px 24px',
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <div style={{
          display: 'inline-block',
          fontFamily: 'JetBrains Mono',
          fontSize: '12px',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          padding: '4px 14px',
          borderRadius: '20px',
          marginBottom: '24px',
          letterSpacing: '0.05em',
        }}>
          Яндекс 360 &middot; Антиспам &middot; Java-миграция
        </div>
        <h1 style={{
          margin: '0 0 8px',
          fontFamily: 'JetBrains Mono',
          fontSize: '48px',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          <span style={{ color: 'var(--cpp-color)' }}>C++</span>
          <span style={{ color: 'var(--text-muted)', margin: '0 16px' }}>&rarr;</span>
          <span style={{ color: 'var(--java-color)' }}>Java</span>
        </h1>
        <p style={{
          margin: '0 0 8px',
          fontFamily: 'JetBrains Mono',
          fontSize: '20px',
          color: 'var(--text-secondary)',
          fontWeight: 400,
        }}>Migration Lab</p>
        <p style={{
          margin: '24px auto 0',
          maxWidth: '560px',
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          Интерактивный справочник для Java-разработчика,
          которому предстоит мигрировать легаси C++ антиспам-систему.
          Разбираем ключевые различия через реальные примеры.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '64px',
      }}>
        <FeatureCard
          to="/gym"
          icon="◈"
          title="Reading Gym"
          subtitle="Читаем C++ легаси"
          color="var(--cpp-color)"
          description="6 ключевых концептов C++ с параллельным Java-кодом. Учимся читать незнакомые конструкции и находить Java-аналоги."
          items={[
            "Управление памятью и RAII",
            "Указатели и ссылки",
            "STL vs Java Collections",
            "Шаблоны vs Generics",
            "Многопоточность",
            "Заголовочные файлы",
          ]}
        />
        <FeatureCard
          to="/case"
          icon="◎"
          title="Migration Case"
          subtitle="Антиспам-пайплайн"
          color="var(--java-color)"
          description="Реальный кейс: мигрируем 4 компонента C++ антиспам-системы на Java. Сохраняем логику, улучшаем архитектуру."
          items={[
            "MessageParser — парсинг сообщений",
            "RuleEngine — движок правил",
            "FeatureExtractor — признаки для ML",
            "ConcurrentProcessor — 10k+ RPS",
          ]}
        />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        borderTop: '1px solid var(--border)',
        paddingTop: '40px',
      }}>
        {[
          { value: '6', label: 'концептов C++', color: 'var(--cpp-color)' },
          { value: '4', label: 'модуля миграции', color: 'var(--java-color)' },
          { value: '10k+', label: 'RPS в кейсе', color: 'var(--accent-green)' },
        ].map(({ value, label, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '32px',
              fontWeight: 700,
              color,
              marginBottom: '4px',
            }}>{value}</div>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
