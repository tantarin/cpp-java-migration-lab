import { useParams, useNavigate } from 'react-router-dom'
import { gymTopics } from '../data/gymTopics'
import CodeComparison from '../components/CodeComparison'
import QuizCard from '../components/QuizCard'
import Badge from '../components/Badge'

function Sidebar({ topics, activeId, onSelect }) {
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
        Концепты C++
      </div>
      {topics.map((topic) => {
        const isActive = topic.id === activeId
        return (
          <button key={topic.id} onClick={() => onSelect(topic.id)} style={{
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
            transition: 'all 0.1s',
          }}>
            {topic.title}
          </button>
        )
      })}
    </aside>
  )
}

export default function GymPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const activeTopic = gymTopics.find(t => t.id === topicId) || gymTopics[0]

  const handleSelect = (id) => navigate(`/gym/${id}`)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        topics={gymTopics}
        activeId={activeTopic.id}
        onSelect={handleSelect}
      />
      <main style={{
        flex: 1,
        padding: '40px 48px',
        maxWidth: '900px',
        minWidth: 0,
      }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Badge label={activeTopic.badge} color={activeTopic.badgeColor} />
          </div>
          <h1 style={{
            margin: '0 0 12px',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>{activeTopic.title}</h1>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '680px',
          }}>{activeTopic.description}</p>
        </div>

        {/* Key differences */}
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
          }}>Ключевые различия</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeTopic.keyDiffs.map((d, i) => (
              <li key={i} style={{
                fontSize: '13px',
                fontFamily: 'JetBrains Mono',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>{d}</li>
            ))}
          </ul>
        </div>

        {/* Code comparison */}
        <CodeComparison cpp={activeTopic.cpp} java={activeTopic.java} />

        {/* Quiz */}
        <QuizCard
          question={activeTopic.quiz.question}
          answer={activeTopic.quiz.answer}
        />

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}>
          {(() => {
            const idx = gymTopics.findIndex(t => t.id === activeTopic.id)
            const prev = gymTopics[idx - 1]
            const next = gymTopics[idx + 1]
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
