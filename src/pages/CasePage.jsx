import { useParams, useNavigate } from 'react-router-dom'
import { caseModules } from '../data/caseModules'
import CodeComparison from '../components/CodeComparison'
import Badge from '../components/Badge'

function Sidebar({ modules, activeId, onSelect }) {
  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      padding: '24px 0',
      position: 'sticky',
      top: '56px',
      height: 'calc(100vh - 56px)',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '0 16px 16px',
        fontSize: '11px',
        fontFamily: 'JetBrains Mono',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        Антиспам-пайплайн
      </div>
      {modules.map((mod, i) => {
        const isActive = mod.id === activeId
        return (
          <button key={mod.id} onClick={() => onSelect(mod.id)} style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '9px 16px',
            background: isActive ? 'rgba(88, 166, 255, 0.08)' : 'none',
            border: 'none',
            borderLeft: `2px solid ${isActive ? 'var(--accent-blue)' : 'transparent'}`,
            color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 400,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '2px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {mod.title}
          </button>
        )
      })}
    </aside>
  )
}

export default function CasePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const active = caseModules.find(m => m.id === moduleId) || caseModules[0]

  const handleSelect = (id) => navigate(`/case/${id}`)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar modules={caseModules} activeId={active.id} onSelect={handleSelect} />
      <main style={{
        flex: 1,
        padding: '40px 48px',
        maxWidth: '900px',
        minWidth: 0,
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Badge label="Migration Case" color="blue" />
          </div>
          <h1 style={{
            margin: '0 0 4px',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>{active.title}</h1>
          <p style={{
            margin: '0 0 16px',
            fontFamily: 'JetBrains Mono',
            fontSize: '13px',
            color: 'var(--accent-blue)',
          }}>{active.subtitle}</p>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '680px',
          }}>{active.description}</p>
        </div>

        {/* Concepts */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '28px',
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Паттерны миграции</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {active.concepts.map((c, i) => (
              <span key={i} style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                padding: '3px 10px',
                borderRadius: '4px',
              }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Code comparison */}
        <CodeComparison cpp={active.cpp} java={active.java} />

        {/* Notes */}
        <div style={{
          marginTop: '28px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent-green)',
          borderRadius: '8px',
          padding: '16px 20px',
        }}>
          <div style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            color: 'var(--accent-green)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Заметки о миграции</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {active.notes.map((note, i) => (
              <li key={i} style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                fontFamily: 'JetBrains Mono',
              }}>{note}</li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}>
          {(() => {
            const idx = caseModules.findIndex(m => m.id === active.id)
            const prev = caseModules[idx - 1]
            const next = caseModules[idx + 1]
            return (
              <>
                <div>
                  {prev && (
                    <button onClick={() => handleSelect(prev.id)} style={{
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '8px 16px',
                    }}>
                      &larr; {prev.title}
                    </button>
                  )}
                </div>
                <div>
                  {next && (
                    <button onClick={() => handleSelect(next.id)} style={{
                      background: 'rgba(88,166,255,0.1)',
                      border: '1px solid rgba(88,166,255,0.3)',
                      borderRadius: '6px',
                      color: 'var(--accent-blue)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '8px 16px',
                    }}>
                      {next.title} &rarr;
                    </button>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
