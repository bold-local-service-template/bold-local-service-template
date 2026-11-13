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

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const DebugPanel: React.FC = () => {
  if (!isDebugEnabled()) {
    return null;
  }

  return <DebugPanelInner />;
};

const DebugPanelInner: React.FC = () => {
  const debug = useDebugState();
  const [collapsed, setCollapsed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'empty' | 'failed'>('idle');

  const handleCopyConfig = async () => {
    if (debug.lastReceivedConfig === null || debug.lastReceivedConfig === undefined) {
      setCopyStatus('empty');
      setTimeout(() => setCopyStatus('idle'), 2000);
      return;
    }

    const text = JSON.stringify(debug.lastReceivedConfig, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
        return;
      }
    } catch {
      // Fall through to execCommand fallback
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyStatus(ok ? 'copied' : 'failed');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const formattedTime = debug.lastOhConfigTime
    ? new Date(debug.lastOhConfigTime).toLocaleTimeString()
    : '—';

  const copyLabel =
    copyStatus === 'copied'
      ? 'Copied!'
      : copyStatus === 'empty'
      ? 'No config yet'
      : copyStatus === 'failed'
      ? 'Copy failed'
      : 'Copy received config';

  return (
    <aside
      aria-label="OH Config Debug Panel"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: 'min(380px, calc(100vw - 32px))',
        maxHeight: '75vh',
        overflowY: 'auto',
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        color: '#f8fafc',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '12px',
        lineHeight: 1.45,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          borderBottom: collapsed ? 'none' : '1px solid rgba(148, 163, 184, 0.2)',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.02em',
        }}
      >
        <span>OH_CONFIG DEBUG</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand debug panel' : 'Collapse debug panel'}
          style={{
            background: 'rgba(148, 163, 184, 0.16)',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '6px',
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          {collapsed ? 'Expand' : 'Hide'}
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: '10px 12px', display: 'grid', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>OH_READY sent:</span>
            <span>{debug.ohReadySentCount}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Last message origin:</span>
            <span style={{ wordBreak: 'break-all', textAlign: 'right' }}>
              {debug.lastMessageOrigin || '—'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>OH_CONFIG received:</span>
            <span>
              {debug.ohConfigReceivedCount} ({formattedTime})
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Payload size:</span>
            <span>{formatBytes(debug.lastPayloadBytes)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Shape detected:</span>
            <span style={{ color: '#a3e635', fontWeight: 700 }}>{debug.shapeDetected}</span>
          </div>

          <div>
            <div style={{ color: '#94a3b8', marginBottom: '2px' }}>Top-level keys:</div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.85)',
                padding: '4px 6px',
                borderRadius: '6px',
                wordBreak: 'break-word',
              }}
            >
              {debug.topLevelKeys.length > 0 ? debug.topLevelKeys.join(', ') : '—'}
            </div>
          </div>

          <div>
            <div style={{ color: '#94a3b8', marginBottom: '2px' }}>
              Skipped fields ({debug.skippedFields.length}):
            </div>
            {debug.skippedFields.length === 0 ? (
              <div style={{ color: '#86efac', paddingLeft: '4px' }}>None</div>
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
                {debug.skippedFields.map((err, idx) => (
                  <li key={`${err.path}-${idx}`} style={{ marginBottom: '3px', wordBreak: 'break-word' }}>
                    <strong>{err.path}</strong>: {err.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyConfig}
            style={{
              marginTop: '4px',
              width: '100%',
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(163, 230, 53, 0.5)',
              backgroundColor: 'rgba(163, 230, 53, 0.16)',
              color: '#ecfccb',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {copyLabel}
          </button>
        </div>
      )}
    </aside>
  );
};
