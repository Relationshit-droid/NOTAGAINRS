# Love, Actually... The Game - Implementation Guide

## 1. Environment Configuration

1.  Copy `.env.example` to `.env` in the `app/` directory.
2.  Fill in the required API keys:
    *   **Firebase**: Create a project at firebase.google.com. Get your web app's configuration object and place it in `app/src/lib/firebaseClient.ts`.
    *   **ElevenLabs**: Get API Key and Voice ID from elevenlabs.io.
    *   **Mapbox**: Get Public Access Token from mapbox.com.
    *   **Giphy**: Get API Key from developers.giphy.com.
    *   **OpenAI/Anthropic**: Get API keys for AI analysis.
    *   **Stripe**: Get Publishable Key.

## 2. Beta Access System

### Valid Codes
*   `MARCIEBETA`
*   `LOVEBETA2025`
*   `TABSIMONBETA`
*   `BETATESTER` + First 8 chars of SHA-256 hash of email (e.g., `BETATESTER12345678`)

### Usage
1.  Go to **Settings**.
2.  Enter code in the **Beta Access** section.
3.  Click **Verify**.
4.  If successful, "Beta Active" badge appears and Premium features unlock.

## 3. Preview Mode

*   Toggle "Preview Mode" in **Settings**.
*   Go to **Game Library** to see "Coming Soon" games.
*   Beta testers get early access to features marked with badges.

## 4. API Integration Details

*   **Firebase**: Handles Auth, Profiles, Fights, Game Sessions. Realtime features are handled by Firestore.
*   **AI Engine**: Fallback logic: OpenAI -> Anthropic -> Hardcoded responses.
*   **ElevenLabs**: Caches TTS audio files locally to save costs.
*   **Giphy**: Rate limiting (100/day) persisted locally.

## 5. Deployment

*   **Web**: `npm run export:web`
*   **Mobile**: `npx expo run:ios` or `npx expo run:android`
