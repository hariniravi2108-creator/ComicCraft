import React, { useState } from 'react';
import { X, Key, Server, Cpu, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  serverStatus, 
  customApiKey, 
  setCustomApiKey, 
  onRefreshHealth 
}) {
  if (!isOpen) return null;

  const [inputKey, setInputKey] = useState(customApiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setCustomApiKey(inputKey.trim());
    localStorage.setItem('comiccraft_custom_api_key', inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onRefreshHealth();
    }, 1200);
  };

  const handleClearKey = () => {
    setInputKey('');
    setCustomApiKey('');
    localStorage.removeItem('comiccraft_custom_api_key');
    onRefreshHealth();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Key size={20} className="text-yellow-400" />
            <h3>ComicCraft Configuration</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Server Status Section */}
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Server size={15} />
                Backend Status
              </span>
              <button 
                onClick={onRefreshHealth}
                className="action-btn-sm" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                title="Refresh Status"
              >
                <RefreshCw size={12} />
                <span>Check</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginTop: '0.35rem' }}>
              {serverStatus.online ? (
                <>
                  <CheckCircle2 size={16} color="#34d399" />
                  <span style={{ color: '#34d399' }}>Connected to Express Backend (Port 5000)</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} color="#f87171" />
                  <span style={{ color: '#f87171' }}>Backend offline or unreachable</span>
                </>
              )}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              <strong>AI Model:</strong> <code>{serverStatus.model || 'gemini-1.5-flash'}</code>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              <strong>Active Mode:</strong> {serverStatus.geminiConfigured ? (
                <span style={{ color: '#34d399', fontWeight: 600 }}>Live Gemini AI Connected</span>
              ) : (
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Demo Mode (No API key needed for basic testing)</span>
              )}
            </div>
          </div>

          {/* Custom API Key input */}
          <div className="form-group">
            <label htmlFor="apiKeyInput" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Google Gemini API Key:</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#818cf8', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                Get free key from AI Studio <ExternalLink size={11} />
              </a>
            </label>
            <input
              id="apiKeyInput"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="form-input"
            />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Key is stored only locally in your browser session for direct testing, or you can configure <code>GEMINI_API_KEY</code> in <code>backend/.env</code>.
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              onClick={handleSave} 
              className="btn-comic btn-comic-yellow"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {saveSuccess ? 'Saved & Verified!' : 'Save & Apply Key'}
            </button>
            {customApiKey && (
              <button 
                onClick={handleClearKey} 
                className="btn-comic btn-comic-ghost"
              >
                Clear Key
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
