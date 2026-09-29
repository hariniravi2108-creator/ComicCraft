import React from 'react';
import { 
  Sparkles, 
  Users, 
  Laugh, 
  Heart, 
  Zap, 
  Clock, 
  BookOpen, 
  FastForward, 
  RefreshCw 
} from 'lucide-react';

export default function QuickActions({ onAction, disabled, hasMessages }) {
  const actions = [
    { id: 'story', label: 'Generate Story', icon: Sparkles, color: '#facc15' },
    { id: 'characters', label: 'Generate Characters', icon: Users, color: '#a78bfa' },
    { id: 'funny', label: 'Make it Funny', icon: Laugh, color: '#38bdf8' },
    { id: 'action', label: 'Make it Action-Packed', icon: Zap, color: '#f87171' },
    { id: 'emotional', label: 'Make it Emotional', icon: Heart, color: '#f472b6' },
    { id: 'short', label: 'Short Story (3 Panels)', icon: Clock, color: '#fb923c' },
    { id: 'long', label: 'Long Story (6 Panels)', icon: BookOpen, color: '#4ade80' },
    { id: 'continue', label: 'Continue Story', icon: FastForward, color: '#818cf8', disabledUnlessMessages: true },
    { id: 'regenerate', label: 'Regenerate', icon: RefreshCw, color: '#e2e8f0', disabledUnlessMessages: true }
  ];

  return (
    <div className="quick-actions-bar" aria-label="Comic Quick Actions">
      {actions.map((act) => {
        const IconComponent = act.icon;
        const isDisabled = disabled || (act.disabledUnlessMessages && !hasMessages);
        
        return (
          <button
            key={act.id}
            onClick={() => onAction(act.id)}
            disabled={isDisabled}
            className="quick-action-chip"
            style={{ opacity: isDisabled ? 0.45 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
            title={act.label}
          >
            <IconComponent size={14} style={{ color: act.color }} />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}
