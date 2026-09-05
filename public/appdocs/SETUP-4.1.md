# Love Actually... The Game - Setup Guide

## Quick Start

This guide will help you get the app running quickly.

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

1. **Fix Dependency Issues** (Important!)
   The app uses React 18 for compatibility with all UI libraries. Run one of these:
   ```bash
   # Option 1: Use the quick fix script (Windows)
   quick-fix.bat
   
   # Option 2: Manual fix (any OS)
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   
   # Option 3: Use the Node.js fix script
   node fix-dependencies.js
   ```
   
   If you still have issues, try: `npm install --force`

2. **Install Dependencies** (if quick fix doesn't work)
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Variables**
   Copy the `.env` file and add your API keys:
   ```bash
   cp .env.example .env
   ```

   Required API keys:
   - `OPENAI_API_KEY`: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)
   - `MURF_API_KEY`: Get from [Murf AI](https://murf.ai/app/account/api-keys)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## Features Working

✅ **Landing Page**: Interactive sign-up/sign-in with Dr. Marcie personality selection
✅ **Dashboard**: Comprehensive dashboard with 1,400+ activities across 7 categories
✅ **AI Integration**: Dr. Marcie AI with voice synthesis using OpenAI + ElevenLabs
✅ **Game System**: Interactive relationship games and challenges
✅ **Fight Solver**: Emergency conflict resolution with AI guidance
✅ **Daily Metrics**: Relationship health tracking and analytics
✅ **Voice Synthesis**: Dr. Marcie's voice responses
✅ **Responsive Design**: Mobile-first approach

## Current Limitations

- **Database**: Using in-memory storage (data resets on restart)
- **Authentication**: Simple session-based (no real auth system)
- **File Uploads**: Not implemented
- **Real-time Features**: Basic implementation

## API Endpoints

### Couples
- `POST /api/couples` - Create couple account
- `GET /api/couples?coupleId=ID` - Get couple data
- `PUT /api/couples` - Update couple data

### Games
- `POST /api/games` - Start new game session
- `GET /api/games?coupleId=ID` - Get game sessions
- `PUT /api/games` - Update game session

### Fight Solver
- `POST /api/fight-solver` - Create fight resolution session
- `GET /api/fight-solver?coupleId=ID` - Get fight sessions
- `PUT /api/fight-solver` - Update session status

## Dr. Marcie's Personality Levels

1. **Tough Love Rookie** - Warm but blunt (Berta from Two and a Half Men energy)
2. **Reality Check Specialist** - Clinical and analytical (Beverly Hofstadter energy)
3. **Radical Truth Wizard** - Deep truths with no BS (Robin Williams in Good Will Hunting energy)

## Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify keys are correctly set in `.env`
   - Check API quotas and billing
   - Ensure keys have proper permissions

2. **Build Errors**
   - Run `npm run type-check` to check TypeScript
   - Run `npm run lint` to check code quality
   - Clear `.next` cache: `rm -rf .next`
   - If React version conflicts occur, use: `npm install --legacy-peer-deps`

3. **Dependency Installation Issues**
   - Use `npm install --legacy-peer-deps` instead of `npm install`
   - Try `npm install --force` as last resort
   - Ensure Node.js 18+ and npm 9+ are installed
   - Run `quick-fix.bat` (Windows) or `node fix-dependencies.js` (any OS)

3. **Voice Not Playing**
   - Check browser console for audio errors
   - Verify Murf AI API key and quota
   - Try different voice settings

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify all API keys are working
3. Ensure Node.js version is 18+
4. Try clearing node_modules and reinstalling

## Next Steps

To make this production-ready:
1. Set up proper database (PostgreSQL + Prisma)
2. Implement real authentication (NextAuth.js)
3. Add file upload capabilities
4. Implement real-time features (WebSockets)
5. Add payment processing
6. Set up monitoring and analytics

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier
```

Enjoy building stronger relationships with Dr. Marcie! 💕