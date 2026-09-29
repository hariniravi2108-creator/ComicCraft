import React, { useState } from 'react';
import { Copy, Check, Download, Printer, RefreshCw, LayoutGrid, FileText, Bot, User } from 'lucide-react';
import ComicStrip from './ComicStrip';

export default function ChatMessage({ message, onRegenerate, onCopyToast }) {
  const isAssistant = message.role === 'assistant';
  const [viewMode, setViewMode] = useState('both'); // 'both', 'comic', 'script'
  const [copied, setCopied] = useState(false);

  // Extract comic-json block if present
  let comicData = null;
  let cleanContent = message.content || '';

  if (isAssistant && cleanContent.includes('```comic-json')) {
    try {
      const match = cleanContent.match(/```comic-json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        comicData = JSON.parse(match[1]);
        // Remove raw JSON from chat bubble text for clean reading experience
        cleanContent = cleanContent.replace(/```comic-json[\s\S]*?```/, '').trim();
      }
    } catch (e) {
      console.warn('Failed to parse embedded comic JSON:', e);
    }
  }

  // Handle Copy Story to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    if (onCopyToast) onCopyToast('Comic script copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Download Story as Text File
  const handleDownloadTxt = () => {
    const title = comicData?.title ? comicData.title.replace(/[^a-zA-Z0-9]/g, '_') : 'ComicCraft_Story';
    const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (onCopyToast) onCopyToast('Story downloaded as text file! 📥');
  };

  // Handle Print / PDF View
  const handlePrint = () => {
    window.print();
  };

  // Simple Markdown-like formatter for chat text
  const formatMarkdown = (text) => {
    if (!text) return null;
    
    // Split lines and format
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return <h3 key={idx}>{line.replace('### ', '')}</h3>;
      }
      // Header 4
      if (line.startsWith('#### ')) {
        return <h4 key={idx}>{line.replace('#### ', '')}</h4>;
      }
      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={idx} />;
      }
      // Bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().substring(2);
        return (
          <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(itemContent) }} />
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.4rem' }} />;
      }
      // Normal paragraph
      return (
        <p key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      );
    });
  };

  // Helper to parse bold, italic, code
  const parseInlineStyles = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  return (
    <div className={`message-row ${message.role}`}>
      {/* Bot Avatar */}
      {isAssistant && (
        <div className="message-avatar assistant">
          <Bot size={20} />
        </div>
      )}

      {/* Bubble */}
      <div className={`message-bubble ${message.role}`}>
        {/* If Assistant has comic panels, offer view toggle bar */}
        {isAssistant && comicData && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#facc15' }}>
              ✨ Generated Comic Story
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                onClick={() => setViewMode(viewMode === 'comic' ? 'both' : 'comic')}
                className={`action-btn-sm ${viewMode === 'comic' ? 'active' : ''}`}
                title="Comic Visual Panels Only"
              >
                <LayoutGrid size={13} />
                <span>Panels</span>
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'script' ? 'both' : 'script')}
                className={`action-btn-sm ${viewMode === 'script' ? 'active' : ''}`}
                title="Script & Dialogue View"
              >
                <FileText size={13} />
                <span>Script</span>
              </button>
              <button 
                onClick={() => setViewMode('both')}
                className={`action-btn-sm ${viewMode === 'both' ? 'active' : ''}`}
                title="View Both Panels and Script"
              >
                <span>Full Story</span>
              </button>
            </div>
          </div>
        )}

        {/* Text Story Script */}
        {(viewMode === 'both' || viewMode === 'script' || !comicData) && (
          <div className="message-text">
            {formatMarkdown(cleanContent)}
          </div>
        )}

        {/* Visual Comic Panels Grid */}
        {isAssistant && comicData && (viewMode === 'both' || viewMode === 'comic') && (
          <ComicStrip comicData={comicData} />
        )}

        {/* Assistant Action Toolbar */}
        {isAssistant && (
          <div className="message-action-toolbar">
            <button 
              onClick={handleCopy}
              className="action-btn-sm"
              title="Copy Story Script"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button 
              onClick={handleDownloadTxt}
              className="action-btn-sm"
              title="Download as .txt"
            >
              <Download size={13} />
              <span>Download TXT</span>
            </button>

            <button 
              onClick={handlePrint}
              className="action-btn-sm"
              title="Download / Print PDF"
            >
              <Printer size={13} />
              <span>Print / PDF</span>
            </button>

            {onRegenerate && (
              <button 
                onClick={onRegenerate}
                className="action-btn-sm"
                title="Regenerate this comic"
              >
                <RefreshCw size={13} />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="message-avatar user">
          <User size={20} />
        </div>
      )}
    </div>
  );
}
