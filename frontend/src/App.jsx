import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessage from './components/ChatMessage';
import QuickActions from './components/QuickActions';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import ProjectInfoModal from './components/ProjectInfoModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Brainstorming comic panels... 🎨');
  const [serverStatus, setServerStatus] = useState({ online: false, geminiConfigured: false, model: 'gemini-1.5-flash' });
  const [customApiKey, setCustomApiKey] = useState(localStorage.getItem('comiccraft_custom_api_key') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lastPrompt, setLastPrompt] = useState('');

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Check Backend Health on Mount
  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          online: true,
          geminiConfigured: data.geminiConfigured || !!customApiKey,
          model: data.model || 'gemini-1.5-flash'
        });
      } else {
        setServerStatus((prev) => ({ ...prev, online: false }));
      }
    } catch (err) {
      console.warn('Backend health check error:', err);
      setServerStatus((prev) => ({ ...prev, online: false }));
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [customApiKey]);

  // Toast helper
  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Cycling loading stages
  useEffect(() => {
    if (!isLoading) return;
    const stages = [
      'Brainstorming comic idea... 💡',
      'Designing vibrant characters... 👥',
      'Framing camera angles & scenes... 🎬',
      'Inking dialogues and speech bubbles... 🗯️',
      'Adding comic sound effects (POW! BAM!)... 💥'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % stages.length;
      setLoadingStage(stages[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Send Message Logic
  const handleSendMessage = async (userText = inputText, actionModifier = '') => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    setLastPrompt(textToSend);
    setInputText('');

    const newMsgId = Date.now();
    const userMessage = {
      id: newMsgId,
      role: 'user',
      content: textToSend
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Build multi-turn history for backend
    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      text: m.content
    }));

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          action: actionModifier
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || 'Gemini API failed to respond.');
      }

      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.text,
        isDemo: data.isDemo
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Pop celebratory confetti for comic creation
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#facc15', '#6366f1', '#ec4899', '#10b981']
        });
      } catch (e) {
        // ignore if confetti fails
      }

      if (data.isDemo) {
        addToast('Created in Demo Mode! Add GEMINI_API_KEY in .env for live AI.', 'info');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        isError: true,
        content: `⚠️ **Comic Generation Error:** ${error.message}\n\nPlease check your internet connection or Gemini API Key in Settings, or click below to retry.`
      };
      setMessages((prev) => [...prev, errorMessage]);
      addToast('Comic generation failed. You can retry!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action Handler
  const handleQuickAction = (actionId) => {
    if (isLoading) return;

    if (actionId === 'regenerate') {
      if (lastPrompt) {
        handleSendMessage(lastPrompt, 'regenerate');
      } else if (messages.length > 0) {
        handleSendMessage('Please regenerate this comic story with fresh creative twists!', 'regenerate');
      }
      return;
    }

    if (actionId === 'continue') {
      handleSendMessage('Continue our comic story into the next episode with 3 new dramatic panels!', 'continue');
      return;
    }

    const currentTopic = lastPrompt || 'College life adventure';
    let promptModifier = '';
    switch (actionId) {
      case 'funny':
        promptModifier = `Take "${currentTopic}" and make it hilarious with funny comic situations and witty punchlines!`;
        break;
      case 'action':
        promptModifier = `Make "${currentTopic}" intensely action-packed with superpowers, combat stunts, and big sound effects!`;
        break;
      case 'emotional':
        promptModifier = `Infuse "${currentTopic}" with heartfelt emotional depth, friendship sentiment, and dramatic dialogue.`;
        break;
      case 'short':
        promptModifier = `Create a quick 3-panel punchy comic strip based on "${currentTopic}".`;
        break;
      case 'long':
        promptModifier = `Create an epic 6-panel complete comic saga based on "${currentTopic}".`;
        break;
      case 'characters':
        promptModifier = `Create 4 memorable comic characters with unique names, superpowers, costumes, and catchphrases.`;
        break;
      case 'story':
      default:
        promptModifier = `Create an exciting comic story with title, characters, and panels about: ${currentTopic}`;
    }

    handleSendMessage(promptModifier, actionId);
  };

  // New Chat / Clear
  const handleNewChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Start a new comic story? This will clear the current chat history.')) {
      setMessages([]);
      setInputText('');
      setLastPrompt('');
      addToast('Started a fresh ComicCraft canvas! 🎨', 'success');
    }
  };

  return (
    <div className="app-container comic-bg-pattern">
      {/* Header */}
      <Header
        onNewChat={handleNewChat}
        serverStatus={serverStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Stream */}
      <main className="chat-main-area">
        <div className="chat-content-wrapper">
          {messages.length === 0 ? (
            <WelcomeScreen
              onSelectPrompt={(text) => {
                setInputText(text);
              }}
            />
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRegenerate={msg.role === 'assistant' && !msg.isError ? () => handleQuickAction('regenerate') : null}
                  onCopyToast={(txt) => addToast(txt, 'success')}
                />
              ))}

              {/* Typing / Generating Indicator */}
              {isLoading && (
                <div className="message-row assistant">
                  <div className="typing-indicator-box">
                    <div className="typing-dots">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                    <span className="typing-status-text">{loadingStage}</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Quick Action Chips Bar */}
      <QuickActions
        onAction={handleQuickAction}
        disabled={isLoading}
        hasMessages={messages.length > 0}
      />

      {/* Bottom Chat Input */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        onClear={handleNewChat}
        hasMessages={messages.length > 0}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        serverStatus={serverStatus}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        onRefreshHealth={checkHealth}
      />

      {/* Project Presentation Info Modal */}
      <ProjectInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.text}
          </div>
        ))}
      </div>
    </div>
  );
}
