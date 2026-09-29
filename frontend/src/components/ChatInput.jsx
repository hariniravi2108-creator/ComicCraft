import React, { useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles, Trash2 } from 'lucide-react';

export default function ChatInput({ 
  inputText, 
  setInputText, 
  onSend, 
  isLoading, 
  onClear,
  hasMessages 
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  // Focus textarea on load
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="chat-input-bar-container">
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Gemini AI is crafting your comic story..." : "Describe a comic idea, character concept, or plot twist... (Enter to send)"}
          disabled={isLoading}
          rows={1}
          className="chat-textarea"
        />

        <button
          onClick={onSend}
          disabled={isLoading || !inputText.trim()}
          className="send-btn"
          title="Send to Gemini AI"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="input-footer-hint">
        <span>
          Press <kbd style={{ background: '#1e293b', padding: '1px 5px', borderRadius: '4px', border: '1px solid #334155' }}>Enter ↵</kbd> to send, <kbd style={{ background: '#1e293b', padding: '1px 5px', borderRadius: '4px', border: '1px solid #334155' }}>Shift + Enter</kbd> for new line
        </span>

        {hasMessages && (
          <button
            onClick={onClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.72rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer'
            }}
            title="Clear current story"
          >
            <Trash2 size={12} />
            <span>Clear Story</span>
          </button>
        )}
      </div>
    </div>
  );
}
