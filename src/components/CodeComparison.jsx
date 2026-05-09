import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function CodePanel({ label, code, language, color }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'var(--bg-elevated)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-muted)',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '13px',
          fontWeight: 600,
          color,
        }}>{label}</span>
        <button onClick={handleCopy} style={{
          background: 'none',
          border: `1px solid var(--border)`,
          borderRadius: '5px',
          color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '11px',
          padding: '3px 10px',
          fontFamily: 'JetBrains Mono',
          transition: 'all 0.15s',
        }}>
          {copied ? 'скопировано' : 'копировать'}
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '16px',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: 'JetBrains Mono',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: 'var(--text-muted)',
            minWidth: '2.5em',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default function CodeComparison({ cpp, java }) {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <CodePanel
        label="C++"
        code={cpp}
        language="cpp"
        color="var(--cpp-color)"
      />
      <CodePanel
        label="Java"
        code={java}
        language="java"
        color="var(--java-color)"
      />
    </div>
  )
}
