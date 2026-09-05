# Deployment Instructions

## 1. Vercel Deployment
To deploy the `dist` folder to Vercel:

1.  **Install Vercel CLI** (if not installed):
    ```bash
    npm install -g vercel
    ```

2.  **Standard Production Deploy**:
    Run the following command in the `app` directory (this builds the web app and deploys it):
    ```bash
    npm run deploy
    ```
    *Select `dist` as the output directory if asked.*

3.  **Custom Preview Deploy (Windows)**:
    If you want to deploy a preview and alias it to a custom domain (like the scripts you found), use the PowerShell script:
    ```powershell
    .\deploy-custom.ps1
    ```
    *Note: Edit the script first to set your custom domain.*

## 2. Environment Variables
Ensure the following environment variables are set in your Vercel Project Settings:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API Key |
| `EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE` | Voice ID for Marcie |
| `EXPO_PUBLIC_MAPBOX_API_KEY` | Mapbox Public Key |
| `EXPO_PUBLIC_GIPHY_API_KEY` | Giphy API Key |

**Firebase Configuration:**

Your Firebase configuration object should be placed in `app/src/lib/firebaseClient.ts`. This file is not checked into version control, so you will need to create it in your Vercel environment.

*Refer to `.env.example` for the template.*

## 3. QA & Verification
After deployment:
1.  Visit the preview URL (e.g., `https://love-actually-beta.vercel.app`).
2.  Open `/test-report.html` to view the QA report.
3.  Test the **Beta Code**: Enter `LOVEBETA2025` in Settings.
4.  Test **SOS**: Click the heart button.
