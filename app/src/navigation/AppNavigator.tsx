import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme';
import BottomTabNavigator from './BottomTabNavigator';

// Main Screens
import MainGameLibrary from '../screens/MainGameLibrary';
import LoveArcadeHub from '../screens/LoveArcadeHub';
import LoveArcadeGameDetailScreen from '../screens/LoveArcadeGameDetailScreen';
import LoveArcadeGamePlayScreen from '../screens/LoveArcadeGamePlayScreen';
import LoveArcadeGameResultsScreen from '../screens/LoveArcadeGameResultsScreen';
import LoveArcadeProgressMapScreen from '../screens/LoveArcadeProgressMapScreen';
import LoveArcadeTrophyRoomScreen from '../screens/LoveArcadeTrophyRoomScreen';
import LoveArcadeSettingsScreen from '../screens/LoveArcadeSettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import GameLibraryGridView from '../screens/GameLibraryGridView';

// Romance Hub Screens
import MemoryGalleryScreen from '../screens/MemoryGalleryScreen';
import LoveLanguageDashboardScreen from '../screens/LoveLanguageDashboardScreen';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import WebSplash from '../screens/auth/WebSplash';
import SignInScreen from '../screens/auth/SignInScreen';
import LoginAndSignUp from '../screens/auth/LoginAndSignUp';
import LegalDisclaimerScreen from '../screens/auth/LegalDisclaimerScreen';
import OriginStoryScreen from '../screens/auth/OriginStoryScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';

// Onboarding Screens
import OnboardingMeetCute from '../screens/onboarding/OnboardingMeetCute';
import OnboardingFirstRedFlag from '../screens/onboarding/OnboardingFirstRedFlag';
import OnboardingCurrentVibe from '../screens/onboarding/OnboardingCurrentVibe';
import OnboardingAttachmentStyle from '../screens/onboarding/OnboardingAttachmentStyle';
import CoupleLinkingScreen from '../screens/onboarding/CoupleLinkingScreen';
import CoupleLinking1 from '../screens/CoupleLinking1';
import CoupleLinking2 from '../screens/CoupleLinking2';

// Dashboard Screens
import DashboardHome from '../screens/dashboard/DashboardHome';
import PartnerDashboard from '../screens/dashboard/PartnerDashboard';
import PartnerTranslator from '../screens/dashboard/PartnerTranslator';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import SettingsScreen from '../screens/dashboard/SettingsScreen';
import AchievementsScreen from '../screens/dashboard/AchievementsScreen';
import LeaderboardScreen from '../screens/dashboard/LeaderboardScreen';
import TrustThermometerDetailScreen from '../screens/dashboard/TrustThermometerDetailScreen';
import CategoryDetailScreen from '../screens/dashboard/CategoryDetailScreen';
import GameSearchScreen from '../screens/dashboard/GameSearchScreen';
import RecommendedGamesScreen from '../screens/dashboard/RecommendedGamesScreen';
import StreakCalendarScreen from '../screens/dashboard/StreakCalendarScreen';
import AnalyticsDashboardScreen from '../screens/dashboard/AnalyticsDashboardScreen';
import WeeklyReportScreen from '../screens/dashboard/WeeklyReportScreen';

// Settings Screens
import AccountSettingsScreen from '../screens/settings/AccountSettingsScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/settings/PrivacySettingsScreen';
import AccessibilitySettingsScreen from '../screens/settings/AccessibilitySettingsScreen';
import SubscriptionSettingsScreen from '../screens/settings/SubscriptionSettingsScreen';
import PersonalitySettingsScreen from '../screens/settings/PersonalitySettingsScreen';
import ConsequenceSettingsScreen from '../screens/settings/ConsequenceSettingsScreen';
import DataPrivacySettingsScreen from '../screens/settings/DataPrivacySettingsScreen';

// SOS Screens
import SOSModal from '../screens/sos/SOSModal';
import BoothsScreen from '../screens/sos/BoothsScreen';
import CoolDownRoom from '../screens/sos/CoolDownRoom';
import VerdictScreen from '../screens/sos/VerdictScreen';
import SOSConfirmationScreen from '../screens/sos/SOSConfirmationScreen';
import SOSEmergencyBooths from '../screens/sos/SOSEmergencyBooths';
import SOSHoldingRoom from '../screens/sos/SOSHoldingRoom';
import SOSVerdictScreen from '../screens/sos/SOSVerdictScreen';
import SOSRepairSelection from '../screens/sos/SOSRepairSelection';
import SOSRepairExecution from '../screens/sos/SOSRepairExecution';
import SOSPostRepairQuestionnaire from '../screens/sos/SOSPostRepairQuestionnaire';
import SOSResultsSummary from '../screens/sos/SOSResultsSummary';

// Game Screens
import TruthOrTrust from '../screens/games/TruthOrTrust';
import GratitudeCloud from '../screens/games/GratitudeCloud';
import EyeContactChallenge from '../screens/games/EyeContactChallenge';
import MemoryLaneMap from '../screens/games/MemoryLaneMap';
import VibeSync from '../screens/games/VibeSync';
import GratitudeGraffiti from '../screens/games/GratitudeGraffiti';
import SlapOfTruth from '../screens/games/SlapOfTruth';
import ApologyAuction from '../screens/games/ApologyAuction';
import DefensivenessDetox from '../screens/games/DefensivenessDetox';
import WhosRight from '../screens/games/WhosRight';
import StressTest from '../screens/games/StressTest';
import ApologyOlympics from '../screens/games/ApologyOlympics';
import RoleSwapRoast from '../screens/games/RoleSwapRoast';
import DrawYourFeelingsGame from '../screens/games/DrawYourFeelingsGame';
import GifTheFeels from '../screens/games/GifTheFeels';
import KaraokeConfessional from '../screens/games/KaraokeConfessional';
import RansomNoteRomance from '../screens/games/RansomNoteRomance';
import DateNightRoulette from '../screens/games/DateNightRoulette';
import BedroomBingoGame1 from '../screens/games/BedroomBingoGame1';
import SixSecondKiss from '../screens/games/SixSecondKiss';
import ForeplayForecast from '../screens/games/ForeplayForecast';
import TouchMap from '../screens/games/TouchMap';
import TouchMapConfiguration from '../screens/games/TouchMapConfiguration';
import WindowsAndWalls from '../screens/games/WindowsAndWalls';
import TriggerTriage from '../screens/games/TriggerTriage';
import TrustBank from '../screens/games/TrustBank';
import TheIceberg from '../screens/games/TheIceberg';
import SecrecyAudit from '../screens/games/SecrecyAudit';
import CouplesJeopardyGame from '../screens/games/CouplesJeopardyGame';
import RelationalJeopardy from '../screens/games/RelationalJeopardy';
import CouplesFamilyFeudGame from '../screens/games/CouplesFamilyFeudGame';
import NewlywedGame from '../screens/games/NewlywedGame';
import IntimacyFeud from '../screens/games/IntimacyFeud';
import EscapeEchoChamber from '../screens/games/EscapeEchoChamber';
import ChoppedFamily from '../screens/games/ChoppedFamily';
import HarborMasterChallenge from '../screens/games/HarborMasterChallenge';
import ValidationGameShow from '../screens/games/ValidationGameShow';
import ConnectionConstructor from '../screens/games/ConnectionConstructor';
import AdmirationAim from '../screens/games/AdmirationAim';
import AmazingRaceCrossroads from '../screens/games/AmazingRaceCrossroads';
import AntidoteArena from '../screens/games/AntidoteArena';
import BidRadar from '../screens/games/BidRadar';
import CycleBreaker from '../screens/games/CycleBreaker';
import DreamDecoder from '../screens/games/DreamDecoder';
import EmpathyEcho from '../screens/games/EmpathyEcho';
import VowRemix from '../screens/games/VowRemix';
import TrustBingo from '../screens/games/TrustBingo';
import TruthTellerTower from '../screens/games/TruthTellerTower';
import BPDPatternDetective from '../screens/games/BPDPatternDetective';
import GameResultsScreen from '../screens/games/GameResultsScreen';

// Additional screens
import TranslationReveal from '../screens/TranslationReveal';
import TranslatorActionPlan from '../screens/TranslatorActionPlan';
import CrisisResources from '../screens/CrisisResources';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import HelpAndFaqScreen from '../screens/HelpAndFaqScreen';
import OfflineMode from '../screens/OfflineMode';
import UpdateRequired from '../screens/UpdateRequired';
import LoadingMarcieIsThinking from '../screens/LoadingMarcieIsThinking';
import RelationshipDiagnosisCard from '../screens/RelationshipDiagnosisCard';
import IntimacyLevelSettings from '../screens/IntimacyLevelSettings';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="MainGameLibrary" 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        orientation: 'portrait',
        statusBarStyle: 'light',
        statusBarBackgroundColor: COLORS.backgroundPrimary,
        statusBarTranslucent: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: COLORS.backgroundPrimary,
        },
      }}
    >
        {/* Main Entry Points */}
        <Stack.Screen name="MainGameLibrary" component={MainGameLibrary} />
        <Stack.Screen name="LoveArcadeHub" component={LoveArcadeHub} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DashboardHome" component={DashboardHome} />
        <Stack.Screen name="CategorySelectionScreen" component={CategorySelectionScreen} />
        <Stack.Screen name="GameLibraryGridView" component={GameLibraryGridView} />

        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ 
          statusBarStyle: 'dark',
          statusBarBackgroundColor: COLORS.textPrimary,
          animation: 'fade'
        }} />
        <Stack.Screen name="WebSplash" component={WebSplash} options={{ 
          statusBarStyle: 'dark',
          statusBarBackgroundColor: COLORS.textPrimary,
          animation: 'fade'
        }} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="LoginAndSignUp" component={LoginAndSignUp} />
        <Stack.Screen name="LegalDisclaimer" component={LegalDisclaimerScreen} />
        <Stack.Screen name="OriginStory" component={OriginStoryScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />

        {/* Onboarding */}
        <Stack.Screen name="OnboardingMeetCute" component={OnboardingMeetCute} />
        <Stack.Screen name="OnboardingFirstRedFlag" component={OnboardingFirstRedFlag} />
        <Stack.Screen name="OnboardingCurrentVibe" component={OnboardingCurrentVibe} />
        <Stack.Screen name="OnboardingAttachmentStyle" component={OnboardingAttachmentStyle} />
        <Stack.Screen name="CoupleLinking" component={CoupleLinkingScreen} />
        <Stack.Screen name="CoupleLinking1" component={CoupleLinking1} />
        <Stack.Screen name="CoupleLinking2" component={CoupleLinking2} />

        {/* Dashboard & Profile */}
        <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
        <Stack.Screen name="PartnerTranslator" component={PartnerTranslator} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="IntimacyLevelSettings" component={IntimacyLevelSettings} />

        {/* New Dashboard Screens */}
        <Stack.Screen name="TrustThermometerDetail" component={TrustThermometerDetailScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="GameSearch" component={GameSearchScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="RecommendedGames" component={RecommendedGamesScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="StreakCalendar" component={StreakCalendarScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboardScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Settings Sub-screens */}
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SubscriptionSettings" component={SubscriptionSettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="PersonalitySettings" component={PersonalitySettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ConsequenceSettings" component={ConsequenceSettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="DataPrivacySettings" component={DataPrivacySettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Love Arcade Screens */}
        <Stack.Screen name="LoveArcadeGameDetail" component={LoveArcadeGameDetailScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveArcadeGamePlay" component={LoveArcadeGamePlayScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveArcadeGameResults" component={LoveArcadeGameResultsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveArcadeProgressMap" component={LoveArcadeProgressMapScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveArcadeTrophyRoom" component={LoveArcadeTrophyRoomScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveArcadeSettings" component={LoveArcadeSettingsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Romance Hub Screens */}
        <Stack.Screen name="MemoryGallery" component={MemoryGalleryScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="LoveLanguageDashboard" component={LoveLanguageDashboardScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* SOS Fight Solver - New 10-Screen Flow */}
        <Stack.Screen name="SOSConfirmation" component={SOSConfirmationScreen} options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="SOSEmergencyBooths" component={SOSEmergencyBooths} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSHoldingRoom" component={SOSHoldingRoom} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSVerdict" component={SOSVerdictScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSRepairSelection" component={SOSRepairSelection} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSRepairExecution" component={SOSRepairExecution} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSPostRepairQuestionnaire" component={SOSPostRepairQuestionnaire} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SOSResultsSummary" component={SOSResultsSummary} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Legacy SOS Screens (keep for backward compat) */}
        <Stack.Screen name="SOSModal" component={SOSModal} options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="SOSBooths" component={BoothsScreen} options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="SOSCoolDown" component={CoolDownRoom} options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="SOSVerdict" component={VerdictScreen} options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} />

        {/* Emotional Connection Games */}
        <Stack.Screen name="TruthOrTrust" component={TruthOrTrust} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="GameResultsScreen" component={GameResultsScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="GratitudeCloud" component={GratitudeCloud} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="EyeContactChallenge" component={EyeContactChallenge} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="MemoryLaneMap" component={MemoryLaneMap} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="VibeSync" component={VibeSync} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="GratitudeGraffiti" component={GratitudeGraffiti} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Conflict Resolution Games */}
        <Stack.Screen name="SlapOfTruth" component={SlapOfTruth} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ApologyAuction" component={ApologyAuction} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="DefensivenessDetox" component={DefensivenessDetox} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="WhosRight" component={WhosRight} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="StressTest" component={StressTest} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ApologyOlympics" component={ApologyOlympics} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Creative Chaos Games */}
        <Stack.Screen name="RoleSwapRoast" component={RoleSwapRoast} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="DrawYourFeelingsGame" component={DrawYourFeelingsGame} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="GifTheFeels" component={GifTheFeels} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="KaraokeConfessional" component={KaraokeConfessional} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="RansomNoteRomance" component={RansomNoteRomance} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Romance Hub Games */}
        <Stack.Screen name="DateNightRoulette" component={DateNightRoulette} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="BedroomBingoGame1" component={BedroomBingoGame1} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SixSecondKiss" component={SixSecondKiss} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ForeplayForecast" component={ForeplayForecast} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TouchMap" component={TouchMap} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TouchMapConfiguration" component={TouchMapConfiguration} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Healing Hospital Games */}
        <Stack.Screen name="WindowsAndWalls" component={WindowsAndWalls} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TriggerTriage" component={TriggerTriage} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TrustBank" component={TrustBank} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TheIceberg" component={TheIceberg} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="SecrecyAudit" component={SecrecyAudit} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Game Show Games */}
        <Stack.Screen name="CouplesJeopardyGame" component={CouplesJeopardyGame} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="RelationalJeopardy" component={RelationalJeopardy} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="CouplesFamilyFeudGame" component={CouplesFamilyFeudGame} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="NewlywedGame" component={NewlywedGame} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="IntimacyFeud" component={IntimacyFeud} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Love Arcade Games */}
        <Stack.Screen name="TruthTellerTower" component={TruthTellerTower} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="EscapeEchoChamber" component={EscapeEchoChamber} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ChoppedFamily" component={ChoppedFamily} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="HarborMasterChallenge" component={HarborMasterChallenge} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ConnectionConstructor" component={ConnectionConstructor} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="ValidationGameShow" component={ValidationGameShow} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="BPDPatternDetective" component={BPDPatternDetective} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Additional Games */}
        <Stack.Screen name="AdmirationAim" component={AdmirationAim} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="AmazingRaceCrossroads" component={AmazingRaceCrossroads} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="AntidoteArena" component={AntidoteArena} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="BidRadar" component={BidRadar} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="CycleBreaker" component={CycleBreaker} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="DreamDecoder" component={DreamDecoder} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="EmpathyEcho" component={EmpathyEcho} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="VowRemix" component={VowRemix} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TrustBingo" component={TrustBingo} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Translator */}
        <Stack.Screen name="TranslationReveal" component={TranslationReveal} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="TranslatorActionPlan" component={TranslatorActionPlan} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Support & Legal */}
        <Stack.Screen name="CrisisResources" component={CrisisResources} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="HelpAndFaq" component={HelpAndFaqScreen} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Special Screens */}
        <Stack.Screen name="OfflineMode" component={OfflineMode} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="UpdateRequired" component={UpdateRequired} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
        <Stack.Screen name="Loading" component={LoadingMarcieIsThinking} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />
         <Stack.Screen name="RelationshipDiagnosis" component={RelationshipDiagnosisCard} options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }} />

        {/* Main App - 7-Tab Bottom Navigation */}
        <Stack.Screen 
          name="MainApp" 
          component={BottomTabNavigator} 
          options={{ 
            headerShown: false,
            animation: 'fade',
            gestureEnabled: false 
          }} 
        />
      </Stack.Navigator>
  );
};

export default AppNavigator;
