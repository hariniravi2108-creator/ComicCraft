import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to get active Gemini API key from environment or request headers
const getApiKey = (req) => {
  return req.headers['x-gemini-api-key'] || process.env.GEMINI_API_KEY || '';
};

// System prompt guiding Gemini to act as the ComicCraft Creative Comic Assistant
const SYSTEM_INSTRUCTION = `You are "ComicCraft AI", an expert comic writer and creative comic-book creator assistant designed for the TN Skills Google Cloud Generative AI project.

Your role is to help users turn simple ideas, character concepts, or everyday situations into engaging, visual, comic-book style stories.

GUIDELINES:
1. Tone: Friendly, creative, encouraging, imaginative, and conversational. Use appropriate comic emojis (🎨, 💥, 🦸, ✨, 💭, 🗯️).
2. When the user starts with a basic idea (e.g. "college friendship", "space superhero"):
   - Brainstorm an exciting Comic Title.
   - List key Characters with quick personality traits & visual descriptions.
   - Divide the story into 3 to 6 comic panels.
3. For EVERY panel, include:
   - Panel Number (e.g., Panel 1, Panel 2)
   - Scene: Visual setting, camera angle (wide shot, close-up, dramatic low angle) and character actions.
   - Characters present & Emotion.
   - Dialogue: Clear speaker names and speech lines.
   - Narration: Caption box text if applicable (e.g., "Meanwhile at the college cafeteria...").
   - Sound FX: Comic sound effects where suitable (e.g., "POW!", "BAM!", "WHOOSH!", "RINGGG!", "CRASH!").
4. If the user asks for characters only, generate 3-4 creative comic characters with names, powers/traits, visual costumes, and catchphrases.
5. If the user asks to modify the story (e.g., "Make it funnier", "Add an alien invasion", "Make it emotional"), adapt the story keeping the characters consistent.
6. STRUCTURED DATA REQUIREMENT:
   In addition to your conversational comic script in markdown, ALWAYS append a JSON block at the very end of your response inside a tagged markdown block:
   \`\`\`comic-json
   {
     "title": "Comic Title",
     "genre": "Comedy | Superhero | Sci-Fi | Slice of Life | Adventure",
     "characters": [
       { "name": "Name", "trait": "Short trait", "description": "Visual look" }
     ],
     "panels": [
       {
         "panelNumber": 1,
         "title": "Short panel heading",
         "scene": "Visual description of the panel scene",
         "camera": "Wide shot | Close-up | Over-the-shoulder",
         "narration": "Optional caption box text or empty string",
         "dialogues": [
           { "speaker": "Character Name", "text": "What they say", "emotion": "Happy/Shocked/etc." }
         ],
         "soundFx": "BAM! / POW! / or empty string",
         "emotion": "Dominant emotion"
       }
     ]
   }
   \`\`\`
   Make sure the JSON inside \`\`\`comic-json ... \`\`\` is valid JSON so the ComicCraft visual panel renderer can render it into comic cards.`;

// Health & configuration check
app.get('/api/health', (req, res) => {
  const envKey = process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    service: 'ComicCraft AI Backend',
    geminiConfigured: !!(envKey && envKey !== 'your_gemini_api_key_here' && envKey.trim().length > 0),
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timestamp: new Date().toISOString()
  });
});

// Fallback demo story generator if Gemini API key is missing or quota exceeded
const generateDemoComic = (promptText, action) => {
  const isCollege = promptText.toLowerCase().includes('college') || promptText.toLowerCase().includes('friend');
  const isSuperhero = promptText.toLowerCase().includes('superhero') || promptText.toLowerCase().includes('hero') || promptText.toLowerCase().includes('power');
  const isSciFi = promptText.toLowerCase().includes('sci-fi') || promptText.toLowerCase().includes('space') || promptText.toLowerCase().includes('alien');

  let title = "The Last Bench Squad";
  let genre = "Slice of Life & Comedy";
  let characters = [
    { name: "Arjun", trait: "Mischievous & Quick-witted", description: "Wears an oversized hoodie and carries a worn-out sketchbook" },
    { name: "Kavin", trait: "The Tech Prodigy", description: "Always equipped with smart glasses and multiple USB cables" },
    { name: "Meena", trait: "Fierce & Creative Leader", description: "Leather jacket with comic badges and a confident smirk" }
  ];

  if (isSuperhero) {
    title = "Chronos: The Paradox Defender";
    genre = "Superhero Action";
    characters = [
      { name: "Rayna / Chrono-Girl", trait: "Can bend time for 5 seconds", description: "Futuristic neon-yellow cyber suit with hourglass gauntlets" },
      { name: "Dr. Glitch", trait: "Rogue cyber-villain", description: "Holographic skull mask with crackling purple energy cables" },
      { name: "Sparky", trait: "A.I. Drone sidekick", description: "Floating spherical robot with expressive digital eyes" }
    ];
  } else if (isSciFi) {
    title = "Star Station 9: Nebula Heist";
    genre = "Sci-Fi Adventure";
    characters = [
      { name: "Captain Zix", trait: "Smuggler with a golden heart", description: "Battered space duster jacket with dual plasma holsters" },
      { name: "Nova", trait: "Telepathic alien navigator", description: "Luminescent blue skin with silver antenna crests" },
      { name: "Unit-X", trait: "Decommissioned battle bot", description: "Heavy rusted titanium plating adorned with alien stickers" }
    ];
  }

  const panels = [
    {
      panelNumber: 1,
      title: "The Calm Before the Storm",
      scene: "Establishing wide shot. Sunlight streams through the classroom windows as the professor's back is turned to the blackboard.",
      camera: "Wide Shot",
      narration: "Friday afternoon. 3:45 PM. The hardest battle of the semester is underway...",
      dialogues: [
        { speaker: characters[0].name, text: "Psst! Did anyone actually finish the AI assignment due in fifteen minutes?", emotion: "Panicked whisper" },
        { speaker: characters[1].name, text: "I finished it. But my code just declared itself sentient and deleted the file.", emotion: "Deadpan serious" }
      ],
      soundFx: "CHALK SCRATCH!",
      emotion: "Hilarious suspense"
    },
    {
      panelNumber: 2,
      title: "Plan B Unleashed",
      scene: "Close-up on Meena slamming a glowing laptop on the desk with an intense grin.",
      camera: "Dynamic Low Angle",
      narration: "Enter the master strategist.",
      dialogues: [
        { speaker: characters[2].name, text: "Don't panic! I synced our backup branch to the cloud three minutes ago!", emotion: "Triumphant" },
        { speaker: characters[0].name, text: "Meena, you're not just a friend, you're a national treasure!", emotion: "Overjoyed" }
      ],
      soundFx: "BAM!",
      emotion: "Relief & Excitement"
    },
    {
      panelNumber: 3,
      title: "The Final Bell",
      scene: "The trio high-fiving in dramatic comic silhouette as the college bell rings violently.",
      camera: "Heroic Silhouette",
      narration: "Another chaotic day survived. Tomorrow, the final semester project awaits!",
      dialogues: [
        { speaker: characters[1].name, text: "Next time, let's just train the AI to attend the lecture for us.", emotion: "Smirking" },
        { speaker: characters[2].name, text: "Deal! Canteen treats are on Arjun!", emotion: "Laughing" }
      ],
      soundFx: "TRRRRRING!",
      emotion: "Celebration"
    }
  ];

  const markdownScript = `### 🎨 ${title}
*Genre: ${genre}*

#### 👥 Characters:
${characters.map(c => `- **${c.name}**: ${c.trait} — *${c.description}*`).join('\n')}

---

#### 🖼️ Panel 1: ${panels[0].title}
**Camera:** ${panels[0].camera}  
**Scene:** ${panels[0].scene}  
**Narration:** *"${panels[0].narration}"*  
${panels[0].dialogues.map(d => `- **${d.speaker}** (${d.emotion}): "${d.text}"`).join('\n')}  
**SFX:** 💥 \`${panels[0].soundFx}\`

---

#### 🖼️ Panel 2: ${panels[1].title}
**Camera:** ${panels[1].camera}  
**Scene:** ${panels[1].scene}  
**Narration:** *"${panels[1].narration}"*  
${panels[1].dialogues.map(d => `- **${d.speaker}** (${d.emotion}): "${d.text}"`).join('\n')}  
**SFX:** 💥 \`${panels[1].soundFx}\`

---

#### 🖼️ Panel 3: ${panels[2].title}
**Camera:** ${panels[2].camera}  
**Scene:** ${panels[2].scene}  
**Narration:** *"${panels[2].narration}"*  
${panels[2].dialogues.map(d => `- **${d.speaker}** (${d.emotion}): "${d.text}"`).join('\n')}  
**SFX:** 💥 \`${panels[2].soundFx}\`

*(Generated in ComicCraft Demo Mode. To connect live Gemini AI, add your GEMINI_API_KEY in backend/.env)*`;

  const jsonBlock = JSON.stringify({ title, genre, characters, panels }, null, 2);
  return `${markdownScript}\n\n\`\`\`comic-json\n${jsonBlock}\n\`\`\``;
};

// Core handler for chat & generation
const handleChatGeneration = async (req, res, userMessage, history = [], action = '') => {
  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ error: true, message: 'Message content is required.' });
  }

  const apiKey = getApiKey(req);

  // If no Gemini API key is configured, provide graceful demo response
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const demoReply = generateDemoComic(userMessage, action);
    return res.json({
      text: demoReply,
      isDemo: true,
      notice: 'Gemini API key is not configured. Running in high-fidelity demo mode. Add your GEMINI_API_KEY to backend/.env to use live Gemini AI.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const selectedModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Prepare history for multi-turn chat
    const formattedHistory = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          formattedHistory.push({
            role: item.role === 'assistant' ? 'model' : item.role,
            parts: [{ text: item.text }]
          });
        }
      }
    }

    // Enhance prompt if an action modifier was provided
    let augmentedMessage = userMessage;
    if (action === 'funny') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Infuse sharp humor, witty banter, comedic panel situations, and funny sound effects!]`;
    } else if (action === 'emotional') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Emphasize deep emotional bonds, poignant dialogue, heartfelt character reflections, and touching story beats.]`;
    } else if (action === 'action') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Make this intensely action-packed, fast-paced, with dynamic combat or chase sequences, dramatic angles, and loud sound effects (POW, BAM, WHOOSH)!]`;
    } else if (action === 'short') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Create a concise, high-impact 3-panel comic strip with a punchy conclusion.]`;
    } else if (action === 'long') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Create a complete, detailed 6-panel comic narrative exploring full story progression.]`;
    } else if (action === 'characters') {
      augmentedMessage = `${userMessage}\n\n[Instruction: Generate 3-4 rich comic character profiles with names, traits, distinctive visual appearances, and catchphrases.]`;
    } else if (action === 'continue') {
      augmentedMessage = `Continue our comic story into the next episode/issue. Advance the plot from the previous panels with new conflicts and surprising twists!`;
    }

    const chatSession = model.startChat({
      history: formattedHistory
    });

    const result = await chatSession.sendMessage(augmentedMessage);
    const response = await result.response;
    const responseText = response.text();

    return res.json({
      text: responseText,
      isDemo: false
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    const errorMessage = error?.message || 'Failed to generate comic with Gemini AI.';
    const isQuotaOrKey = errorMessage.includes('API_KEY_INVALID') || 
                         errorMessage.includes('quota') || 
                         errorMessage.includes('ResourceExhausted') || 
                         errorMessage.includes('403') ||
                         errorMessage.includes('400');

    // Return friendly error with fallback suggestion
    return res.status(500).json({
      error: true,
      message: isQuotaOrKey 
        ? `Gemini API authentication or quota issue: ${errorMessage}` 
        : `Gemini AI communication failed: ${errorMessage}`,
      details: errorMessage,
      fallbackSuggestion: 'You can verify your GEMINI_API_KEY in backend/.env, or test with the offline demo generator.'
    });
  }
};

// Main Chat & Story Creation Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history = [], action = '' } = req.body;
  return handleChatGeneration(req, res, message, history, action);
});

// Quick action helper endpoint
app.post('/api/quick-action', async (req, res) => {
  const { action, currentStoryPrompt, history = [] } = req.body;
  
  let promptText = '';
  switch (action) {
    case 'funny':
      promptText = `Take the comic idea "${currentStoryPrompt || 'College life'}" and make it intensely funny with comedic panel mishaps, hilarious punchlines, and quirky character traits.`;
      break;
    case 'emotional':
      promptText = `Take the comic idea "${currentStoryPrompt || 'Friendship journey'}" and make it heartwarming and emotional, highlighting deep friendship, trust, and poignant dialogue.`;
      break;
    case 'action':
      promptText = `Create an explosive, high-stakes action comic based on "${currentStoryPrompt || 'Hero vs Rival'}" with superhero stunts, dramatic panel framing, and thunderous SFX!`;
      break;
    case 'continue':
      promptText = `Continue the existing comic story into the next phase/issue. Add 3 new high-stakes panels that resolve or deepen the cliffhanger!`;
      break;
    case 'characters':
      promptText = `Brainstorm 4 iconic comic characters for the universe "${currentStoryPrompt || 'Modern Cyberpunk College'}". Give each a title, personality, comic look, and catchphrase.`;
      break;
    case 'short':
      promptText = `Create a quick 3-panel punchline comic strip based on: "${currentStoryPrompt || 'Daily college struggles'}".`;
      break;
    case 'long':
      promptText = `Create an epic 6-panel comic narrative arc with full exposition, rising action, climax, and resolution based on: "${currentStoryPrompt || 'The Legend of TN Warriors'}".`;
      break;
    default:
      promptText = currentStoryPrompt || 'Create an exciting comic story!';
  }

  return handleChatGeneration(req, res, promptText, history, action);
});

// Start listening
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` ComicCraft Backend Server Running!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Gemini API Key Configured: ${process.env.GEMINI_API_KEY ? 'YES (Secure)' : 'NO (Demo Mode Active)'}`);
  console.log(`=========================================`);
});
