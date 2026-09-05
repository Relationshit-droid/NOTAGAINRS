# Love, Actually... The Game - PRD

## Overview
A relationship therapy gamification app that helps couples improve communication, resolve conflicts, and strengthen their bond through AI-powered games and Dr. Marcie's witty therapeutic guidance.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python) 
- **Database**: Firebase (planned - currently in-memory)
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Platform**: Web (with existing React Native Expo codebase for future mobile)

### Services
- Backend API: Port 8001
- Frontend: Port 3000

## User Personas
1. **Couples in Crisis** - Need immediate conflict resolution (SOS feature)
2. **Growth-Oriented Couples** - Want to strengthen relationship through games
3. **Post-Betrayal Rebuilders** - Working through trust issues (Healing Hospital, Love Arcade)

## Core Requirements

### 7 Game Categories
1. ❤️ **Emotional Connection** - SEEN Method games (5 games)
2. 🛡️ **Conflict Resolution** - Gottman-inspired healing (5 games)
3. ✨ **Creative Chaos** - Playful creative challenges (5 games)
4. 🔥 **Romance Hub** - Spicy & sweet connections (5 games)
5. 💜 **Healing Hospital** - Deep repair & recovery (5 games)
6. 🏆 **Game Show** - Classic formats (5 games)
7. 🎮 **The Love Arcade** - Championship matches (6 games) ★ FEATURED

### The Love Arcade Games
- Truth Teller Tower (Phase 1: Foundation)
- Escape from the Echo Chamber (Phase 2: Deconstruction)
- The Intimacy Feud (Phase 3: Shared Reality)
- Relational Jeopardy! (Phase 4: The Future)
- Family Forge Edition (Special: Family Building)
- Harbor & Storm Edition (Special: BPD/Emotional Regulation)

### Dr. Marcie AI System
4 Sarcasm Levels:
1. Tough Love Rookie - Mild sarcasm, warm but blunt
2. Reality Check Specialist - Clinical, analytical sarcasm
3. Radical Truth Wizard - Deep, powerful, poetic truth
4. The Glamour Oracle - Full Noir Prophecy Mode (Maya Angelou meets Joan Rivers)

### SOS Fight Solver
- Real-time conflict resolution
- Confession Booth (I feel / When partner / Because I tell myself / What I need)
- AI-powered verdict generation
- Cool-down breathing exercises

## What's Been Implemented ✅
- [x] Main Game Library with 7 categories
- [x] Category filtering and search
- [x] The Love Arcade hub with 6 championship games
- [x] SOS Fight Solver with 4 sarcasm levels
- [x] Confession Booth form
- [x] Dr. Marcie AI integration (GPT-4o)
- [x] Dashboard with relationship meters
- [x] Navigation system between all screens
- [x] Backend API with all endpoints
- [x] 53 Marcie images integrated

## Prioritized Backlog

### P0 (Critical)
- [ ] Firebase authentication integration
- [ ] Couple linking with real-time sync
- [ ] Game play implementation for existing 150+ game screens

### P1 (High)
- [ ] Partner Translator feature
- [ ] Achievements & badges system
- [ ] Streak tracking
- [ ] Subscription/payment integration

### P2 (Medium)
- [ ] ElevenLabs voice synthesis for Marcie
- [ ] Push notifications
- [ ] Admin portal functionality
- [ ] Analytics dashboard

### P3 (Future)
- [ ] Mobile app deployment (Expo)
- [ ] Consequence Engine (wallpaper swap)
- [ ] Digital Bonfire finale ritual
- [ ] Community leaderboards

## Next Tasks
1. Implement Firebase authentication
2. Build couple linking real-time sync
3. Connect existing 150+ game screens to navigation
4. Add game play logic to Love Arcade games

---
*Last Updated: January 2026*
