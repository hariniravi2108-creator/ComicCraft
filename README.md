# ComicCraft – AI Comic Story Creator 🎨✨
> **A TN Skills Google Cloud Generative AI Project**  
> *Transform your imagination into engaging, visual, comic-book stories using Google Gemini AI.*

---

## 🌟 Project Overview
**ComicCraft** is an interactive, modern AI-powered comic storyboarding web application built for the **TN Skills Google Cloud Generative AI** initiative. 

Operating like a creative, conversational AI assistant, ComicCraft enables students, writers, and comic enthusiasts to enter a simple premise (such as a college dilemma, superhero concept, or sci-fi adventure) and collaboratively generate complete comic scripts with characters, titles, scene descriptions, dialogues, narration boxes, and dynamic sound effects (POW, BAM, WHOOSH!).

---

## ✨ Features
- 💬 **Conversational Comic Writing Assistant**: Brainstorm ideas, refine scenes, and modify characters collaboratively in real time.
- 🖼️ **Comic-Style Visual Panel Cards**: Each scene is framed in pop-art style comic cards with:
  - Panel numbering & camera framing (Wide shot, Close-up, Heroic low angle)
  - Yellow comic caption/narration boxes
  - Dialogue speech bubbles tailored to each character with emotion badges
  - Iconic comic sound effect badges (e.g., *POW!*, *BAM!*, *CHALK SCRATCH!*)
- ⚡ **Instant Quick-Action Chips**:
  - 🎨 **Generate Story**: Create a full multi-panel comic narrative.
  - 👥 **Generate Characters**: Brainstorm memorable comic character profiles.
  - 😂 **Make it Funny**: Infuse witty humor and situational comedy.
  - 💖 **Make it Emotional**: Add heartfelt friendship themes and drama.
  - 💥 **Make it Action-Packed**: Accelerate pacing with superpowers, combat, and high-energy stunts.
  - ⏱️ **Short Story (3 Panels)**: Quick punchy strip.
  - 📜 **Long Story (6 Panels)**: Complete story saga.
  - ➡️ **Continue Story**: Advance the comic into the next issue or chapter.
  - 🔄 **Regenerate Story**: Fresh creative variations with a single click.
- 📋 **Export & Sharing**:
  - One-click copy formatted script to clipboard.
  - Download complete comic script as `.txt`.
  - Print / Save as styled Comic PDF directly from the browser.
- ⚙️ **Dual-Mode Reliability (Live Gemini AI + Offline Demo Mode)**:
  - Connects to Google Gemini AI via secure backend environment variables.
  - Includes a fallback offline generator so presentations and project evaluations never crash if internet or API quota runs out.
- 🔒 **Enterprise-Grade Security**:
  - API keys are never exposed to client-side bundles.
  - Managed via `.env` with `.gitignore` protection.

---

## 🛠️ Technologies Used

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: Google Fonts (*Outfit*, *Fredoka*, *Bangers*)
- **Styling**: Vanilla CSS Design System with Comic Pop-Art Aesthetics, Dark Mode, and CSS Grid

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **AI SDK**: [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini SDK)
- **Security & Networking**: `dotenv`, `cors`

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                      Client Browser                    │
│   (React + Vite UI • Port 3000 • Modern Comic Design)  │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP POST /api/chat
                            │  (Vite Dev Proxy)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Node.js Express Server               │
│                  (Backend API • Port 5000)             │
│   - Validates input & history                          │
│   - Enforces ComicCraft System Instructions            │
│   - Securely loads GEMINI_API_KEY from .env            │
└───────────────────────────┬────────────────────────────┘
                            │  Google GenAI SDK
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Google Cloud Gemini AI                 │
│               Model: gemini-1.5-flash                  │
│   - Multi-turn Conversational Memory                   │
│   - Creative comic plot decomposition                  │
│   - Structured 'comic-json' extraction                 │
└────────────────────────────────────────────────────────┘
```

---

## 🤖 How Gemini AI is Used
1. **Multi-Turn Story Memory**: History is retained across turns so you can chat conversationally (e.g., *"Make Arjun more confident in panel 2"*).
2. **Dual Output Generation**:
   - **Markdown Dialogue Script**: Clean, readable script displayed in the conversational chat bubble.
   - **Structured Comic JSON**: Tagged JSON data (`comic-json`) parsed on the client to render visual panels, speech bubbles, and camera angles.
3. **Prompt Augmentation**: Quick actions prepend specialized directive tags without disrupting conversational context.

---

## 📂 Project Directory Structure

```text
comiccraft/
├── backend/
│   ├── .env.example        # Backend environment template
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express API server & Gemini integration
├── frontend/
│   ├── public/
│   │   └── favicon.svg     # ComicCraft brand icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx        # Bottom input with auto-resize & keyboard shortcuts
│   │   │   ├── ChatMessage.jsx      # Message bubble with markdown & visual panel renderer
│   │   │   ├── ComicStrip.jsx       # Visual comic panels, speech bubbles, SFX badges
│   │   │   ├── Header.jsx           # Top navigation, status indicator & branding
│   │   │   ├── ProjectInfoModal.jsx # TN Skills presentation & architecture modal
│   │   │   ├── QuickActions.jsx     # Action chips (Funny, Action, Short, Long, etc.)
│   │   │   ├── SettingsModal.jsx    # API key tester & configuration modal
│   │   │   └── WelcomeScreen.jsx    # Welcome banner & 4 example prompt cards
│   │   ├── App.jsx                  # Main React application controller
│   │   ├── index.css                # Comic design system & responsive styling
│   │   └── main.jsx                 # React root entrypoint
│   ├── index.html                   # HTML5 template with SEO & Google Fonts
│   ├── package.json                 # Frontend dependencies & scripts
│   └── vite.config.js               # Vite config with /api proxy to Port 5000
├── .env.example                     # Root environment template
├── .gitignore                       # Ensures .env, node_modules, and builds are excluded
├── package.json                     # Root orchestrator scripts
└── README.md                        # Complete project documentation
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **NPM** (v9.0.0 or higher)
- A **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone or Navigate to the Project
```bash
cd ComicCraft
```

---

### Step 2: Install Dependencies
You can install dependencies for both frontend and backend using the root command:
```bash
npm run install:all
```
*Or install them individually:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 3: Configure Environment Variables
1. In the `backend/` folder, copy `.env.example` to `.env`:
   ```bash
   # On Windows PowerShell:
   Copy-Item backend/.env.example backend/.env

   # On Linux / macOS / Bash:
   cp backend/.env.example backend/.env
   ```
2. Open `backend/.env` and paste your Gemini API Key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere
   GEMINI_MODEL=gemini-1.5-flash
   ```

> 💡 **Note**: If you don't provide an API key, ComicCraft automatically operates in **High-Fidelity Demo Mode**, allowing you to test all UI interactions, prompt cards, and panel renders without crashing!

---

### Step 4: Run the Application

#### Option A: Run Backend & Frontend in Two Terminals (Recommended for Dev)

**Terminal 1 (Backend Server):**
```bash
cd backend
npm start
```
*The backend will run on `http://localhost:5000`.*

**Terminal 2 (Frontend React App):**
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:3000`.*

#### Option B: Run via Root Scripts
```bash
# Start backend:
npm run start:backend

# In another terminal, start frontend:
npm run dev:frontend
```

---

## 📖 How to Use ComicCraft

1. **Open the App**: Visit [http://localhost:3000](http://localhost:3000) in your web browser.
2. **Choose a Starting Idea**:
   - Click one of the 4 welcome cards (*Superhero comic*, *Funny college story*, *Friendship adventure*, or *Sci-fi story*), OR
   - Type your own idea in the bottom input bar (e.g., *"A story about two rival street food chefs competing for the golden ladle"*).
3. **Generate**: Press <kbd>Enter</kbd> or click the yellow **Send** button.
4. **Explore the Comic Panels**:
   - View speech bubbles, scene directions, narration, and sound effect tags.
   - Switch between **Panels View**, **Script View**, or **Full Story**.
5. **Refine with Quick Action Chips**:
   - Click **😂 Make it Funny** or **💥 Make it Action-Packed**.
   - Click **➡️ Continue Story** to advance to the next issue.
6. **Export**:
   - Click **Copy** to paste the script into any document.
   - Click **Download TXT** to save as a text file.
   - Click **Print / PDF** to print or export a clean comic book sheet!

---

## 🔮 Future Enhancements
- 🎨 **AI Image Generation Integration**: Connect Google Imagen / Imagen 3 to automatically generate illustrated artwork for each panel.
- 🗣️ **Multilingual Dialogue**: Generate comics in regional languages (Tamil, Hindi, Spanish, etc.).
- 👥 **Community Gallery**: Save and share created comics to a public gallery.
- 📱 **PWA Support**: Offline progressive web app for mobile reading.

---

## 👥 Team & Project Information
- **Project Name**: ComicCraft – AI Comic Story Creator
- **Program**: TN Skills Google Cloud Generative AI
- **Domain**: Cloud Artificial Intelligence & Conversational Generative Media
- **License**: MIT Open Source License

---

*Made with ❤️ for TN Skills Google Cloud Generative AI Initiative.*
