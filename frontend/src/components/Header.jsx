import React from 'react';
import { BookOpen, Sparkles, Plus, Settings, Info, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ 
  onNewChat, 
  serverStatus, 
  onOpenSettings, 
  onOpenInfo,
  hasMessages 
}) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-logo-icon">
          <BookOpen size={24} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>
            ComicCraft
            <Sparkles size={18} className="text-yellow-400" />
          </h1>
          <p>AI Comic Story Creator • TN Skills</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Status Indicator */}
        <div 
          className={`status-badge ${serverStatus.geminiConfigured ? '' : 'demo'}`}
          title={serverStatus.geminiConfigured ? "Connected to Google Gemini AI" : "Running in High-Fidelity Demo Mode"}
        >
          <span className="status-dot"></span>
          <span>{serverStatus.geminiConfigured ? 'Gemini AI Live' : 'Demo Mode'}</span>
        </div>

        {/* Project Info Modal Button */}
        <button 
          onClick={onOpenInfo}
          className="btn-comic btn-comic-ghost"
          title="Project Details & Presentation Info"
        >
          <Info size={16} />
          <span className="hide-on-mobile">Project Info</span>
        </button>

        {/* Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="btn-comic btn-comic-ghost"
          title="API & Settings"
        >
          <Settings size={16} />
          <span className="hide-on-mobile">Settings</span>
        </button>

        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className="btn-comic btn-comic-yellow"
          title="Start a new comic story"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
}
