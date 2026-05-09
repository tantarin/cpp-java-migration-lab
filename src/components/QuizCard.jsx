import { useState } from 'react'

export default function QuizCard({ question, answer }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '24px',
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '12px',
          color: 'var(--accent-orange)',
          background: 'rgba(210, 153, 34, 0.1)',
          border: '1px solid rgba(210, 153, 34, 0.3)',
          padding: '2px 10px',
          borderRadius: '4px',
        }}>Задание</span>
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{
          margin: '0 0 16px',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          fontFamily: 'JetBrains Mono',
          fontSize: '13px',
        }}>
          {question}
        </p>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} style={{
            background: 'rgba(88, 166, 255, 0.1)',
            border: '1px solid rgba(88, 166, 255, 0.3)',
            borderRadius: '6px',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            padding: '8px 20px',
            transition: 'all 0.15s',
          }}>
            Показать ответ
          </button>
        ) : (
          <div style={{
            background: 'rgba(63, 185, 80, 0.06)',
            border: '1px solid rgba(63, 185, 80, 0.2)',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'var(--accent-green)',
              }}>Ответ</span>
            </div>
            <p style={{
              margin: 0,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              fontSize: '14px',
            }}>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
