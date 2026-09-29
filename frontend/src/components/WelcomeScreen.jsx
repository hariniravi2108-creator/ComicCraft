import React from 'react';
import { Sparkles, ArrowRight, Zap, Laugh, Heart, Rocket } from 'lucide-react';

export default function WelcomeScreen({ onSelectPrompt }) {
  const examplePrompts = [
    {
      id: 1,
      title: "Create a superhero comic",
      subtitle: "Action-packed heroic clash with cosmic superpowers & intense villains",
      icon: "🦸‍♂️",
      color: "#ec4899",
      text: "Create a superhero comic about a young inventor who accidentally creates an hourglass gauntlet that can bend time for 5 seconds."
    },
    {
      id: 2,
      title: "Create a funny college story",
      subtitle: "Hilarious exam deadline panic, back-bench banter & canteen antics",
      icon: "🎓",
      color: "#facc15",
      text: "Create a funny college story about three friends trying to submit their AI project 10 minutes before the midnight deadline."
    },
    {
      id: 3,
      title: "Create a friendship adventure",
      subtitle: "Heartwarming journey through unexpected obstacles & unbreakable bonds",
      icon: "🤝",
      color: "#10b981",
      text: "Create a friendship adventure about two childhood rivals who must team up to navigate a hidden underground labyrinth beneath their school."
    },
    {
      id: 4,
      title: "Create a sci-fi story",
      subtitle: "Cyberpunk space station heists, rogue AI companions & alien mysteries",
      icon: "🚀",
      color: "#06b6d4",
      text: "Create a sci-fi story set on Star Station 9 about a rebellious pilot and an expressive droid trying to outsmart cosmic bounty hunters."
    }
  ];

  return (
    <div className="welcome-hero">
      <div className="welcome-badge">
        <Sparkles size={14} />
        <span>TN Skills • Google Cloud Generative AI</span>
      </div>

      <h2 className="welcome-title">
        Welcome to <span>ComicCraft! ✨</span>
      </h2>

      <p className="welcome-subtitle">
        Turn your imagination into an amazing comic story with Gemini AI. 
        Describe any character, setting, or wild idea and watch it come alive in structured comic panels!
      </p>

      <div className="prompt-cards-grid">
        {examplePrompts.map((prompt) => (
          <div 
            key={prompt.id} 
            className="prompt-card"
            onClick={() => onSelectPrompt(prompt.text)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectPrompt(prompt.text)}
          >
            <div 
              className="prompt-card-icon"
              style={{ backgroundColor: `${prompt.color}25`, borderColor: prompt.color }}
            >
              <span>{prompt.icon}</span>
            </div>
            <h4>
              <span>{prompt.title}</span>
              <ArrowRight size={16} className="text-muted" />
            </h4>
            <p>{prompt.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
