import React from 'react';
import { X, Award, Cloud, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProjectInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={20} className="text-yellow-400" />
            <h3>ComicCraft – Project Presentation Info</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
          {/* Badge */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(245, 158, 11, 0.15))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ color: '#facc15', fontSize: '1rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cloud size={18} />
              TN Skills • Google Cloud Generative AI Project
            </h4>
            <p style={{ color: '#cbd5e1' }}>
              ComicCraft demonstrates real-world application of Google Gemini Large Language Models in creative multimedia writing and conversational storyboarding.
            </p>
          </div>

          {/* System Architecture */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="#818cf8" />
              System Architecture
            </h4>
            <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'monospace', fontSize: '0.8rem', color: '#93c5fd' }}>
              [React + Vite Frontend (Port 3000)]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ (HTTP JSON API)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Node.js + Express Backend (Port 5000)]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ (Google GenAI SDK)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br/>
              [Google Gemini 1.5 Flash Model]
            </div>
          </div>

          {/* How Gemini is Used */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} color="#34d399" />
              How Gemini AI is Engineered
            </h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1' }}>
              <li><strong>Multi-turn Conversational Memory:</strong> Contextual awareness of past panels so users can ask "Make Arjun braver" or "Add an alien invasion".</li>
              <li><strong>Dual-Output Parsing:</strong> Gemini generates natural prose for reading and structured <code>comic-json</code> for interactive visual cards.</li>
              <li><strong>Panel Decomposition:</strong> Automates extraction of camera angles, character dialogue, narration caption boxes, and SFX pop badges.</li>
              <li><strong>Safe Key Management:</strong> API keys remain encrypted on the server side via <code>.env</code>.</li>
            </ul>
          </div>

          {/* Presentation Highlights */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '0.85rem' }}>
            <h4 style={{ color: '#34d399', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
              College Demonstration Checklist
            </h4>
            <ul style={{ paddingLeft: '1.2rem', color: '#e2e8f0', fontSize: '0.8rem' }}>
              <li>Click an example prompt card (e.g. "Create a funny college story").</li>
              <li>Show the Gemini AI typing status with animated comic steps.</li>
              <li>Showcase the visual Comic Cards with Speech Bubbles, SFX badges, and Narration boxes.</li>
              <li>Demonstrate quick action buttons: "Make it Action-Packed" or "Short Story".</li>
              <li>Click "Download TXT" or "Print / PDF" to export the comic script.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
