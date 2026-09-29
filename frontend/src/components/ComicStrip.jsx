import React from 'react';
import { Camera, Film, Users, MessageSquareQuote, Volume2, Sparkles } from 'lucide-react';

export default function ComicStrip({ comicData }) {
  if (!comicData || !comicData.panels || comicData.panels.length === 0) {
    return null;
  }

  const { title, genre, characters = [], panels = [] } = comicData;

  // Sound FX badge colors
  const sfxColors = ['#ef4444', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="comic-strip-container">
      {/* Header Info Bar */}
      <div className="comic-strip-header">
        <div className="comic-strip-title">
          <Sparkles size={20} className="text-yellow-400" />
          <h3>{title || "Comic Visualizer Strip"}</h3>
          {genre && <span className="genre-tag">{genre}</span>}
        </div>
      </div>

      {/* Characters Pill Bar if present */}
      {characters && characters.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <Users size={15} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cast & Characters</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {characters.map((char, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem'
                }}
              >
                <strong style={{ color: '#facc15' }}>{char.name}</strong>
                {char.trait && <span style={{ color: '#cbd5e1' }}> — {char.trait}</span>}
                {char.description && (
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
                    "{char.description}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comic Panels Grid */}
      <div className="panels-grid">
        {panels.map((panel, index) => {
          const sfxColor = sfxColors[index % sfxColors.length];
          const panelNum = panel.panelNumber || index + 1;

          return (
            <div key={index} className="comic-panel-card">
              {/* Card Top Border / Header */}
              <div className="panel-card-top">
                <span className="panel-badge">PANEL {panelNum}</span>
                <span className="camera-badge">
                  {panel.camera ? `📹 ${panel.camera}` : (panel.title || `SCENE ${panelNum}`)}
                </span>
              </div>

              {/* Panel Content Body */}
              <div className="panel-card-body">
                {/* Yellow Narration Box */}
                {panel.narration && panel.narration.trim() && (
                  <div className="narration-box">
                    <span className="narration-label">NARRATOR</span>
                    "{panel.narration}"
                  </div>
                )}

                {/* Scene Description Box */}
                {panel.scene && (
                  <div className="scene-description-box">
                    <span className="scene-label">SCENE & ACTION</span>
                    {panel.scene}
                  </div>
                )}

                {/* Sound FX Starburst if present */}
                {panel.soundFx && panel.soundFx.trim() && (
                  <div 
                    className="sfx-badge"
                    style={{ backgroundColor: sfxColor }}
                  >
                    💥 {panel.soundFx}
                  </div>
                )}

                {/* Dialogue Speech Bubbles */}
                {panel.dialogues && panel.dialogues.length > 0 && (
                  <div className="dialogues-wrapper">
                    {panel.dialogues.map((dlg, dIdx) => (
                      <div key={dIdx} className="speech-bubble">
                        <div className="speech-speaker-row">
                          <span className="speech-speaker">🗣️ {dlg.speaker}</span>
                          {dlg.emotion && (
                            <span className="speech-emotion">{dlg.emotion}</span>
                          )}
                        </div>
                        <div className="speech-text">
                          "{dlg.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
