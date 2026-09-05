# relationshit

A couples therapy app disguised as a game, hosted by Dr. Marcie Liss - a brutally honest AI therapist with charm, wit, and zero tolerance for BS.

> **Multi-Source Integration**: This project was built by comparing and merging content from 5 source versions:
> - `LOVETRAE-1` (Desktop copy) — app entry files & assets, `.env`
> - `LOVETRAE-backup-20260227` (Desktop backup) — merge conflict reference
> - `RELATIONSHIT` (GitHub) — **primary base** (clean, no conflicts)
> - `LOVETHEGAME-BYHYDRA` (GitHub) — additional fonts, logos, Marcie gesture/expression images
> - `LOVEACTUALLYTHEGAME4.1` (GitHub) — advanced analytics engine, comprehensive 1,400 activity system, Dr. Marcie AI services, Next.js web UI components

## 🎮 Overview

This app transforms couples therapy into an engaging game experience with:
- 7 different game categories focused on relationship building
- The Love Arcade - championship matches of honesty and emotional parkour
- Dr. Marcie Liss AI therapist with 4 levels of "sarcasm therapy"
- Real-time couple synchronization
- SOS Fight Solver for conflict resolution

## 🛠 Tech Stack

- **Frontend**: React Native Expo (TypeScript)
- **Backend**: FastAPI (Python)
- **Database**: Firebase Firestore
- **AI**: Google Gemini (1.5 Flash/Pro) for relationship coaching and therapy simulation.
- **UI**: Tailwind CSS with NativeWind

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Expo CLI installed globally

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd relationshit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` file in the `app` directory:
```bash
EXPO_PUBLIC_API_URL=http://localhost:8001
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# AI API Keys (optional for local development)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

4. **Run the development servers**

Start both backend and frontend:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:app
```

## 📁 Project Structure

```
relationshit/
├── app/                          # React Native Expo mobile app
│   ├── src/                      # 657 source files (60+ game screens, navigation, components)
│   │   ├── assets/               # Fonts, logos, Marcie images, animations
│   │   ├── components/           # UI components, game engine, Dr. Marcie overlays
│   │   ├── screens/              # All game screens (60+), onboarding, SOS, admin
│   │   ├── lib/                  # Core utilities (Firebase, AI, API, auth)
│   │   ├── navigation/           # App navigators
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # React contexts
│   │   ├── state/                # State management store
│   │   └── __tests__/            # Test specs
│   └── eas.json                  # EAS build configuration
├── backend/                      # FastAPI Python backend (34 files)
│   ├── src/
│   │   ├── routes/               # API routes (auth, games, couples, SOS, analytics)
│   │   ├── middleware/           # Middleware (CORS, rate limiting, etc.)
│   │   ├── security/             # Auth & security utilities
│   │   └── integrations/
│   │       └── lovetreatygame41/ # Advanced analytics + 1400-activity system (from LOVEACTUALLYTHEGAME4.1)
│   ├── server.py                 # Main FastAPI server
│   └── requirements.txt
├── frontend/                     # React web frontend (83 files)
├── admin/                        # Firebase Functions + game data (24 files)
│   ├── src/                      # Game data JSON files (6 games)
│   └── functions/                # Cloud Functions
├── functions/                    # Firebase Cloud Functions (9 files)
├── public/                       # Public web assets (514 files)
│   ├── appdocs/                  # App documentation
│   ├── fonts/                    # Font files
│   ├── newmarcie/                # Marcie images
│   └── animations/               # Marcie video animations
├── scripts/                      # Utility scripts
├── firebase.json                 # Firebase configuration
├── .firebaserc                   # Firebase project reference
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore indexes
├── cloudbuild.yaml               # Google Cloud Build config
└── package.json                  # Root monorepo package

### Backend API Endpoints
- `/api/users` - User management
- `/api/couples/link` - Couple linking
- `/api/games/categories` - Game categories
- `/api/love-arcade/games` - Love Arcade games
- `/api/marcie/chat` - Dr. Marcie AI interactions
- `/api/sos/sessions` - SOS conflict resolution

### Real-time Features
- WebSocket connections for couple synchronization
- Firebase Firestore for persistent data
- Live presence detection

## 🎯 Game Categories

1. **Emotional Connection** - SEEN Method focused games
2. **Conflict Resolution** - Gottman-inspired healing
3. **Creative Chaos** - Playful creative challenges
4. **Romance Hub** - Spicy & sweet connections
5. **Healing Hospital** - Deep repair & recovery
6. **Game Show** - Classic formats
7. **The Love Arcade** - Championship matches (featured)

## 🤖 Dr. Marcie AI System

4 Sarcasm Levels:
1. **Tough Love Rookie** - Mild sarcasm, warm but blunt
2. **Reality Check Specialist** - Clinical, analytical sarcasm
3. **Radical Truth Wizard** - Deep, powerful, poetic truth
4. **The Glamour Oracle** - Full Noir Prophecy Mode

## 📱 Deployment

### Backend (Render)
1. Create a Render account
2. Create a new Web Service
3. Connect to this GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables as needed

### Frontend (Expo)
```bash
cd app
expo publish
```

Or build for specific platforms:
```bash
expo build:android
expo build:ios
```

## 🧪 Testing

Run backend tests:
```bash
npm run test:backend
```

## 🔧 Troubleshooting

### Common Issues

1. **Backend not connecting to frontend**
   - Ensure both are running on the correct ports
   - Check your `.env` file has the correct `EXPO_PUBLIC_API_URL`

2. **Firebase authentication not working**
   - Verify your Firebase project configuration
   - Ensure environment variables are properly set

3. **Dr. Marcie AI not responding**
   - Check that your LLM API keys are properly configured
   - Verify network connectivity to the AI provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for couples everywhere. **relationshit** - Because relationships deserve better than avoidance.