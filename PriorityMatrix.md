
| Feature | Implementation Status | Security/Logic Risk | Immediate Next Step |
| :--- | :--- | :--- | :--- |
| **API Security** | | | |
| ElevenLabs API | Client-side key | High (Key exposed) | Refactor to Cloud Function |
| OpenAI/Anthropic API | Client-side key | High (Key exposed) | Refactor to Cloud Function |
| Stripe API | Server-side | Low | None |
| **Database Integrity** | | | |
| Core Schema | Implemented | Low | None |
| Linking Codes | Implemented | Low | None |
| Trust Thermometer | Implemented | Low | None |
| **Logic Layer** | | | |
| Beta Code Validation | Client-side | Medium | Refactor to Cloud Function |
| Game Scoring | Client-side | Medium | Refactor to Cloud Function |
| Consequence Engine | Client-side | Medium | Refactor to Cloud Function |
| **Multiplayer State** | | | |
| Game State Sync | Local State (AsyncStorage) | High (No real-time sync) | Implement Firestore/Supabase real-time listeners |
