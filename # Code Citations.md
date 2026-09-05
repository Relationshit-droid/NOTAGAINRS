# Code Citations

## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── report
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: MIT
https://github.com/Winzana/react-structure-core-exemple/blob/2fc1a170e285c6d9339f2dcbf4f9d5eb84d9e8f5/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```


## License: unknown
https://github.com/zingerbread/tarot/blob/001b5210bf20346971fcc59e8a800c848913a9d1/.github/README.md

```
Here's the complete project structure:

```
LOVETRAE-1/
├── .emergent/
├── .expo/
├── .firebaserc
├── .git/
├── .gitconfig
├── .gitignore
├── .idea/
├── .idx/
├── .qodo/
├── admin/
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── audit.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── models.js
│   │   ├── models.js.map
│   │   ├── seed.js
│   │   └── seed.js.map
│   ├── src/
│   │   ├── achievements-and-badges.json
│   │   ├── admiration-aim.json
│   │   ├── amazing-race-crossroads.json
│   │   ├── antidote-arena.json
│   │   ├── apology-auction.json
│   │   ├── index.ts
│   │   ├── models.ts
│   │   ├── seed-games.ts
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── ab-testing.spec.ts
│   │   │   ├── consequence.spec.ts
│   │   │   ├── engine.spec.ts
│   │   │   ├── games.spec.ts
│   │   │   ├── navigation.spec.tsx
│   │   │   └── perf.spec.ts
│   │   ├── assets/
│   │   │   ├── animations/
│   │   │   ├── fonts/
│   │   │   ├── logo/
│   │   │   └── marcieimages/
│   │   ├── components/
│   │   │   ├── ai-host/
│   │   │   ├── effects/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── feedback/
│   │   │   ├── gameplay/
│   │   │   │   └── MarcieHost.tsx
│   │   │   ├── games/
│   │   │   │   ├── DailyChallengeCard.tsx
│   │   │   │   ├── engine/
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── GameRunner.tsx
│   │   │   ├── layout/
│   │   │   │   └── GlobalHeader.tsx
│   │   │   ├── preview/
│   │   │   ├── sos/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   ├── assetManifest.ts
│   │   │   ├── fontFamilies.ts
│   │   │   └── fonts.ts
│   │   ├── features/
│   │   │   └── beta/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePartnerPresence.ts
│   │   ├── lib/
│   │   │   ├── __tests__/
│   │   │   ├── a11y.ts
│   │   │   ├── ab-testing.ts
│   │   │   ├── ai-engine.ts
│   │   │   ├── api.ts
│   │   │   ├── asset-loader.ts
│   │   │   ├── cache.ts
│   │   │   ├── consequence-engine.ts
│   │   │   ├── elevenlabs.ts
│   │   │   ├── encryption.ts
│   │   │   ├── env.ts
│   │   │   ├── firebaseClient.ts
│   │   │   ├── game-persistence.ts
│   │   │   ├── game-store.ts
│   │   │   ├── gating.ts
│   │   │   ├── giphy.ts
│   │   │   ├── mapbox.ts
│   │   │   ├── navigation.ts
│   │   │   ├── perf.ts
│   │   │   ├── scoring.ts
│   │   │   ├── stripe.ts
│   │   │   ├── supabaseClient.ts
│   │   │   ├── ThemeMapper.ts
│   │   │   ├── typography.ts
│   │   │   ├── useBetaAccess.ts
│   │   │   ├── useGameContent.ts
│   │   │   └── voice-engine.ts
│   │   ├── navigation/
│   │   │   └── AdminNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   ├── navigators/
│   │   │   └── MainNavigator.tsx
│   │   ├── screens/
│   │   │   ├── admin/
│   │   │   ├── admin-portal/
│   │   │   ├── auth/
│   │   │   ├── CategorySelectionScreen.tsx
│   │   │   ├── CoupleLinking1.tsx
│   │   │   ├── CoupleLinking2.tsx
│   │   │   ├── crisis/
│   │   │   ├── CrisisResources.tsx
│   │   │   ├── dashboard/
│   │   │   ├── game/
│   │   │   ├── GameLibraryGridView.tsx
│   │   │   ├── games/
│   │   │   ├── GratitudeGraffitiMural.tsx
│   │   │   ├── GuiltVsShameSort.tsx
│   │   │   ├── HarborMastersChallenge.tsx
│   │   │   ├── HeartOfTheMatterGame.tsx
│   │   │   ├── HeartToHeartNewlywedGame.tsx
│   │   │   ├── HelpAndFaqScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── index.ts
│   │   │   ├── IntimacyLevelSettings.tsx
│   │   │   ├── JeopardyRebuildingRound.tsx
│   │   │   ├── LeaderboardDetail[1-8].tsx
│   │   │   ├── LegacyDiceGame.tsx
│   │   │   ├── LieDetectorLite.tsx
│   │   │   ├── LoadingMarcieIsThinking.tsx
│   │   │   ├── LoginAndSignUp.tsx
│   │   │   ├── LoveArcadeHub.tsx
│   │   │   ├── LoveMapGapQuest[1-2].tsx
│   │   │   ├── LoveMapSpeedrunGame.tsx
│   │   │   ├── MainGameLibrary.tsx
│   │   │   ├── matchmaking/
│   │   │   ├── MemoryLaneGpsGame.tsx
│   │   │   ├── MemoryLaneMapGame.tsx
│   │   │   ├── MicroBetrayalMiniGolfGame.tsx
│   │   │   ├── MicroMomentMuseumGame[1-2].tsx
│   │   │   ├── MirrorModeVideoGame.tsx
│   │   │   ├── NewlywedSyncCheckGame.tsx
│   │   │   ├── OfflineMode.tsx
│   │   │   ├── onboarding/
│   │   │   ├── PartnerComparisonProfile.tsx
│   │   │   ├── planning/
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── RateTheExperience.tsx
│   │   │   ├── RelationalJeopardy.tsx
│   │   │   ├── RelationshipDiagnosisCard[1-3].tsx
│   │   │   ├── settings/
│   │   │   ├── sos/
│   │   │   ├── support/
│   │   │   ├── TheHarborAndStormGuide.tsx
│   │   │   ├── TranslationReveal.tsx
│   │   │   ├── TranslatorActionPlan[9-10].tsx
│   │   │   ├── UpdateRequired.tsx
│   │   │   ├── UserProfileScreen.tsx
│   │   │   ├── VibeSyncSlider.tsx
│   │   │   ├── WelcomeAndDisclaimer.tsx
│   │   │   └── workshops/
│   │   ├── state/
│   │   │   ├── Provider.tsx
│   │   │   ├── store.ts
│   │   │   └── __tests__/
│   │   ├── types/
│   │   │   ├── nativewind.d.ts
│   │   │   └── shims.d.ts
│   │   ├── global.css
│   │   └── theme.ts
│   ├── assets/
│   │   ├── animations/
│   │   ├── favicon.png
│   │   ├── fonts/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   ├── logo/
│   │   └── marcieimages/
│   ├── cypress/
│   │   └── e2e/
│   │       ├── beta_unlock.cy.ts
│   │       └── sos_sync.cy.ts
│   ├── lib/
│   │   └── firebaseClient.ts
│   ├── scripts/
│   │   ├── check-bundle.js
│   │   ├── postexport.js
│   │   ├── scan-dist.js
│   │   └── security-check.js
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── cypress.config.js
│   ├── DEPLOY_INSTRUCTIONS.md
│   ├── deploy-custom.ps1
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── expo-env.d.ts
│   ├── index.ts
│   ├── jest.config.js
│   ├── jest.expo-linking.stub.js
│   ├── jest.rn.mock.stub.js
│   ├── jest.setup.ts
│   ├── metro.config.js
│   ├── package.json
│   ├── README_SETUP.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GameLibrary.tsx
│   │   │   ├── games/
│   │   │   ├── LoveArcade.tsx
│   │   │   └── SOSFightSolver.tsx
│   │   ├── lib/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   └── setupTests.ts
│   ├── public/
│   │   ├
```

