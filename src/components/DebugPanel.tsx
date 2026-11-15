import React, { useState } from 'react';
import { useDebugState } from '../siteConfig';

function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get('debug') === '1';
  } catch {
    return false;
  }
}

export const DebugPanel: React.FC = () => {
  if (!isDebugEnabled()) {
    return null;
  }

  return <DebugPanelInner />;
};

const DebugPanelInner: React.FC = () => {
  const debug = useDebugState();
  const [rawOpen, setRawOpen] = useState(false);

  const formattedTime = debug.lastMessageTime
    ? new Date(debug.lastMessageTime).toLocaleTimeString()
    : 'Never';

  const rawText =
    debug.rawReceivedConfig !== null && debug.rawReceivedConfig !== undefined
      ? JSON.stringify(debug.rawReceivedConfig, null, 2)
      : 'None';

  return (
    <aside
      aria-label="OH Config Debug Panel"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        width: 'min(360px, calc(100vw - 32px))',
        maxHeight: '75vh',
        overflowY: 'auto',
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        color: '#f8fafc',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '10px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '12px',
        lineHeight: 1.45,
        padding: '10px 12px',
        display: 'grid',
        gap: '8px',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.03em',
          borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
          paddingBottom: '6px',
        }}
      >
        OH_CONFIG DEBUG
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ color: '#94a3b8' }}>Last message:</span>
        <span>{formattedTime}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ color: '#94a3b8' }}>Keys applied:</span>
        <span style={{ color: '#a3e635', fontWeight: 700 }}>{debug.appliedCount}</span>
      </div>

      <div>
        <div style={{ color: '#94a3b8', marginBottom: '4px' }}>
          Rejected keys ({debug.rejected.length}):
        </div>
        {debug.rejected.length === 0 ? (
          <div style={{ color: '#86efac' }}>None</div>
        ) : (
          <ul
            style={{
              margin: 0,
              padding: '6px 8px 6px 20px',
              background: 'rgba(127, 29, 29, 0.35)',
              border: '1px solid rgba(248, 113, 113, 0.35)',
              borderRadius: '6px',
              maxHeight: '140px',
              overflowY: 'auto',
              color: '#fecaca',
            }}
          >
            {debug.rejected.map((item, idx) => (
              <li key={`${item.key}-${idx}`} style={{ marginBottom: '3px', wordBreak: 'break-word' }}>
                <strong>{item.key}</strong>: {item.reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setRawOpen((open) => !open)}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#e2e8f0',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '6px',
            padding: '5px 8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'inherit',
          }}
        >
          {rawOpen ? 'Hide raw config' : 'Show raw config'}
        </button>

        {rawOpen && (
          <pre
            style={{
              margin: '6px 0 0',
              padding: '8px',
              background: 'rgba(2, 6, 23, 0.85)',
              borderRadius: '6px',
              maxHeight: '180px',
              overflow: 'auto',
              fontSize: '11px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#cbd5e1',
            }}
          >
            {rawText}
          </pre>
        )}
      </div>
    </aside>
  );
};
