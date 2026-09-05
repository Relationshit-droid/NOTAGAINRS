# Love Actually - The Game (Mobile App)

## 📱 Mobile Application Guide

This document explains how to run and develop the Love Actually - The Game mobile application.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI installed globally: `npm install -g @expo/cli`
- Expo Go app installed on your mobile device (iOS/Android)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd LOVETRAE
```

2. **Navigate to the app directory**
```bash
cd app
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**

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
EXPO_PUBLIC_EMERGENT_LLM_KEY=your_emergent_llm_key
```

## 📲 Running on Mobile Device

### Option 1: Using Expo Go (Recommended for development)

1. **Start the development server**
```bash
npm start
```

2. **Scan the QR code** with the Expo Go app on your mobile device
   - Download Expo Go from the App Store (iOS) or Google Play Store (Android)
   - Use your device's camera to scan the QR code displayed in the terminal

### Option 2: Development Build

1. **Create a development build**
```bash
npx expo run:android    # For Android
npx expo run:ios        # For iOS
```

## 🏗️ Mobile-Specific Features

### Optimized UI Components
- **Responsive Design**: All components adapt to different screen sizes
- **Touch Targets**: Minimum 44px touch targets for easy interaction
- **Mobile Animations**: Optimized animations for mobile performance
- **Safe Areas**: Proper handling of notches and home indicators

### Mobile-First Navigation
- **Gesture Support**: Swipe back, swipe up for modals
- **Bottom Sheets**: For common actions and selections
- **Tab Navigation**: Easy switching between main sections
- **Modal Presentation**: Proper mobile-style overlays

### Performance Optimizations
- **Image Optimization**: Proper sizing and caching for mobile networks
- **Bundle Splitting**: Reduced initial download size
- **Lazy Loading**: Components loaded as needed
- **Memory Management**: Efficient memory usage for mobile devices

## 📱 Mobile-Specific Configurations

### app.json
- Portrait orientation by default
- Custom icons and splash screens
- Platform-specific permissions
- Deep linking support

### Security Permissions
- Camera access (for profile photos)
- Photo library access (for sharing moments)
- Vibration (for haptic feedback)
- Network access (for API calls)

## 📦 Building for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

### Standalone App
```bash
npx expo prebuild
npx expo run:android --mode release
npx expo run:ios --mode release
```

## 🧪 Testing on Mobile

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
# Make sure app is running first
npm start
# Then run tests in another terminal
npx cypress open
```

## 🔧 Troubleshooting Mobile Issues

### Common Issues

1. **Network Requests Failing**
   - Ensure your mobile device is on the same WiFi as your development machine
   - Check that your firewall isn't blocking the connection
   - Use IP address instead of `localhost` in API URLs

2. **Slow Performance**
   - Enable development mode optimizations
   - Reduce image sizes
   - Minimize re-renders

3. **Touch Gestures Not Working**
   - Check if components are properly wrapped in Pressable/TouchableOpacity
   - Ensure no overlapping touch targets

4. **App Crashes on Launch**
   - Clear Expo cache: `npx expo r -c`
   - Check console logs for error messages

## 📊 Mobile Analytics

The app includes mobile-specific analytics:
- Screen view tracking
- User engagement metrics
- Performance monitoring
- Crash reporting (via Sentry)

## 🔄 Updates and Maintenance

### Over-the-Air Updates
```bash
npx expo publish
```

### Version Management
- Update version in `app.json`
- Create build for each platform
- Submit to app stores

## 🆘 Support

For mobile-specific issues:
- Check the Expo documentation
- Review the React Native documentation
- Open an issue in the repository

---

Made with ❤️ for couples everywhere - now optimized for mobile!