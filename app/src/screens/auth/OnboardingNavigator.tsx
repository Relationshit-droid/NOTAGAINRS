import React, { Suspense } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SOSButton from '../../components/sos/SOSButton';
import PreviewOverlay from '../../components/preview/PreviewOverlay';
import { MarcieOverlay } from '../../components/ai-host';
import FeedbackFab from '../../components/feedback/FeedbackFab';
import { navigationRef, navigate, getCurrentState } from '../../lib/navigation';
import { useAppStore } from '../../state/store';
import ErrorBoundary from '../../components/ErrorBoundary';
import Provider from '../../state/Provider';
import { COLORS } from '../../theme';

const SplashScreenLazy = React.lazy(() => import('./SplashScreen'));
const OriginStoryScreenLazy = React.lazy(() => import('./OriginStoryScreen'));
const CoupleCodeScreenLazy = React.lazy(() => import('./CoupleCodeScreen'));
const PartnerEntryScreenLazy = React.lazy(() => import('./PartnerEntryScreen'));

const LegalDisclaimerScreenLazy = React.lazy(() => import('./LegalDisclaimerScreen'));
const SignInScreenLazy = React.lazy(() => import('./SignInScreen'));
const PasswordResetScreenLazy = React.lazy(() => import('./PasswordResetScreen'));
const BoothsScreenLazy = React.lazy(() => import('../sos/BoothsScreen'));
const CoolDownRoomLazy = React.lazy(() => import('../sos/CoolDownRoom'));
const VerdictScreenLazy = React.lazy(() => import('../sos/VerdictScreen'));
const DashboardHomeLazy = React.lazy(() => import('../dashboard/DashboardHome'));
const PartnerTranslatorLazy = React.lazy(() => import('../dashboard/PartnerTranslator'));
const ProfileScreenLazy = React.lazy(() => import('../dashboard/ProfileScreen'));
const PartnerDashboardLazy = React.lazy(() => import('../dashboard/PartnerDashboard'));
const LeaderboardScreenLazy = React.lazy(() => import('../dashboard/LeaderboardScreen'));
const SettingsScreenLazy = React.lazy(() => import('../dashboard/SettingsScreen'));
const SupportScreenLazy = React.lazy(() => import('../support/SupportScreen'));
const AdminPortalLazy = React.lazy(() => import('../admin/AdminPortal'));
const GameLibraryScreenLazy = React.lazy(() => import('../games/GameLibraryScreen'));
const ChallengeScreenLazy = React.lazy(() => import('../games/ChallengeScreen'));
const ResultsRoastLazy = React.lazy(() => import('../games/ResultsRoastScreen'));
const TruthOrTrustLazy = React.lazy(() => import('../games/TruthOrTrust'));
const ApologyAuctionLazy = React.lazy(() => import('../games/ApologyAuction'));
const GratitudeCloudLazy = React.lazy(() => import('../games/GratitudeCloud'));
const EyeContactChallengeLazy = React.lazy(() => import('../games/EyeContactChallenge'));
const MemoryLaneMapLazy = React.lazy(() => import('../games/MemoryLaneMap'));
const SlapOfTruthLazy = React.lazy(() => import('../games/SlapOfTruth'));
const DefensivenessDetoxLazy = React.lazy(() => import('../games/DefensivenessDetox'));
const WhosRightLazy = React.lazy(() => import('../games/WhosRight'));
const StressTestLazy = React.lazy(() => import('../games/StressTest'));
const RoleSwapRoastLazy = React.lazy(() => import('../games/RoleSwapRoast'));
const WindowsAndWallsLazy = React.lazy(() => import('../games/WindowsAndWalls'));
const TriggerTriageLazy = React.lazy(() => import('../games/TriggerTriage'));
const TrustBankLazy = React.lazy(() => import('../games/TrustBank'));
const TheIcebergLazy = React.lazy(() => import('../games/TheIceberg'));
const SecrecyAuditLazy = React.lazy(() => import('../games/SecrecyAudit'));

// New Games
const LieDetectorLazy = React.lazy(() => import('../games/LieDetector'));
const TransparencyTossLazy = React.lazy(() => import('../games/TransparencyToss'));
const BoundaryBingoLazy = React.lazy(() => import('../games/BoundaryBingo'));
const VibeSyncLazy = React.lazy(() => import('../games/VibeSync'));
const RewriteMemoryLazy = React.lazy(() => import('../games/RewriteMemory'));
const GuiltShameSortLazy = React.lazy(() => import('../games/GuiltShameSort'));
const FlashbackFrenzyLazy = React.lazy(() => import('../games/FlashbackFrenzy'));
const DenialDetectorLazy = React.lazy(() => import('../games/DenialDetector'));
const VulnerabilityVolleyLazy = React.lazy(() => import('../games/VulnerabilityVolley'));
const TouchMapLazy = React.lazy(() => import('../games/TouchMap'));
const AvoidanceArcadeLazy = React.lazy(() => import('../games/AvoidanceArcade'));
const NeedsDecoderLazy = React.lazy(() => import('../games/NeedsDecoder'));
const EscapismRoomLazy = React.lazy(() => import('../games/EscapismRoom'));
const BlameFlipLazy = React.lazy(() => import('../games/BlameFlip'));
const MicroBetrayalGolfLazy = React.lazy(() => import('../games/MicroBetrayalGolf'));
const BidRadarLazy = React.lazy(() => import('../games/BidRadar'));
const GentleStartUpGauntletLazy = React.lazy(() => import('../games/GentleStartUpGauntlet'));
const LoveMapSpeedrunLazy = React.lazy(() => import('../games/LoveMapSpeedrun'));
const AntidoteArenaLazy = React.lazy(() => import('../games/AntidoteArena'));
const MirrorModeLazy = React.lazy(() => import('../games/MirrorMode'));
const DreamDecoderLazy = React.lazy(() => import('../games/DreamDecoder'));
const ToneShiftChallengeLazy = React.lazy(() => import('../games/ToneShiftChallenge'));
const RitualBuilderLazy = React.lazy(() => import('../games/RitualBuilder'));
const ConflictDiceLazy = React.lazy(() => import('../games/ConflictDice'));
const AppreciationAuctionLazy = React.lazy(() => import('../games/AppreciationAuction'));
const FloodingForecastLazy = React.lazy(() => import('../games/FloodingForecast'));
const LoveMapGapQuestLazy = React.lazy(() => import('../games/LoveMapGapQuest'));
const SharedMeaningMuralLazy = React.lazy(() => import('../games/SharedMeaningMural'));
const TextToneTranslatorLazy = React.lazy(() => import('../games/TextToneTranslator'));
const RepairRelayLazy = React.lazy(() => import('../games/RepairRelay'));
const SoundtrackSyncLazy = React.lazy(() => import('../games/SoundtrackSync'));
const MicroMomentMuseumLazy = React.lazy(() => import('../games/MicroMomentMuseum'));
const StressSynergyLabLazy = React.lazy(() => import('../games/StressSynergyLab'));
const DreamSupportSprintLazy = React.lazy(() => import('../games/DreamSupportSprint'));
const TurningTowardTallyLazy = React.lazy(() => import('../games/TurningTowardTally'));
const CommitmentDiceLazy = React.lazy(() => import('../games/CommitmentDice'));
const EmpathyEchoLazy = React.lazy(() => import('../games/EmpathyEcho'));
const CompromiseJengaLazy = React.lazy(() => import('../games/CompromiseJenga'));
const RitualRouletteLazy = React.lazy(() => import('../games/RitualRoulette'));
const RoleSwapLazy = React.lazy(() => import('../games/RoleSwap'));
const MemoryLaneDashLazy = React.lazy(() => import('../games/MemoryLaneDash'));
const AdmirationAimLazy = React.lazy(() => import('../games/AdmirationAim'));
const VowRemixLazy = React.lazy(() => import('../games/VowRemix'));
const LegacyDiceLazy = React.lazy(() => import('../games/LegacyDice'));
const ConnectionConundrumLazy = React.lazy(() => import('../games/ConnectionConundrum'));

const TriggerTakedownLazy = React.lazy(() => import('../games/TriggerTakedown'));
const SixSecondStareDownLazy = React.lazy(() => import('../games/SixSecondStareDown'));
const GratitudeGraffitiLazy = React.lazy(() => import('../games/GratitudeGraffiti'));
const MemoryLaneGPSLazy = React.lazy(() => import('../games/MemoryLaneGPS'));
const SixSecondKissLazy = React.lazy(() => import('../games/SixSecondKiss'));
const ForeplayForecastLazy = React.lazy(() => import('../games/ForeplayForecast'));
const RansomNoteRomanceLazy = React.lazy(() => import('../games/RansomNoteRomance'));
const GifTheFeelsLazy = React.lazy(() => import('../games/GifTheFeels'));
const KaraokeConfessionalLazy = React.lazy(() => import('../games/KaraokeConfessional'));
const DateNightRouletteLazy = React.lazy(() => import('../games/DateNightRoulette'));
const RepairReportCardLazy = React.lazy(() => import('../games/RepairReportCard'));
const HealingBingoLazy = React.lazy(() => import('../games/HealingBingo'));
const TheIcebergDiveLazy = React.lazy(() => import('../games/TheIcebergDive'));
const CommitmentCountdownLazy = React.lazy(() => import('../games/CommitmentCountdown'));
const ApologyOlympicsLazy = React.lazy(() => import('../games/ApologyOlympics'));
const TruthTellerTowerLazy = React.lazy(() => import('../games/TruthTellerTower'));
const EscapeEchoChamberLazy = React.lazy(() => import('../games/EscapeEchoChamber'));
const IntimacyFeudLazy = React.lazy(() => import('../games/IntimacyFeud'));
const RelationalJeopardyLazy = React.lazy(() => import('../games/RelationalJeopardy'));
const FamilyFeudNewRealityLazy = React.lazy(() => import('../games/FamilyFeudNewReality'));
const NewlywedGameLazy = React.lazy(() => import('../games/NewlywedGame'));
const ChoppedFamilyLazy = React.lazy(() => import('../games/ChoppedFamily'));
const LegacyDashLazy = React.lazy(() => import('../games/LegacyDash'));
const BPDPatternDetectiveLazy = React.lazy(() => import('../games/BPDPatternDetective'));
const ValidationGameShowLazy = React.lazy(() => import('../games/ValidationGameShow'));
const ConnectionConstructorLazy = React.lazy(() => import('../games/ConnectionConstructor'));
const HarborMasterChallengeLazy = React.lazy(() => import('../games/HarborMasterChallenge'));
// Phoenix Protocol
const TruthTransparencyGauntletLazy = React.lazy(() => import('../games/TruthTransparencyGauntlet'));
const TimelineDetectiveLazy = React.lazy(() => import('../games/TimelineDetective'));
const LayersOfHurtLazy = React.lazy(() => import('../games/LayersOfHurt'));
const TrustBingoLazy = React.lazy(() => import('../games/TrustBingo'));
const FutureCouncilLazy = React.lazy(() => import('../games/FutureCouncil'));
// Trust Renovation
const DeEscalationLabLazy = React.lazy(() => import('../games/DeEscalationLab'));
const CycleBreakerLazy = React.lazy(() => import('../games/CycleBreaker'));
const ApologyWorkshopLazy = React.lazy(() => import('../games/ApologyWorkshop'));
const TrustWiringLazy = React.lazy(() => import('../games/TrustWiring'));
const RelationshipCouncilLazy = React.lazy(() => import('../games/RelationshipCouncil'));
// Word-Wound
const DealOrNoDealAccountabilityLazy = React.lazy(() => import('../games/DealOrNoDealAccountability'));
const FamilyFeudSafetyLazy = React.lazy(() => import('../games/FamilyFeudSafety'));
const NewlywedHeartLazy = React.lazy(() => import('../games/NewlywedHeart'));
const JeopardyRebuildingLazy = React.lazy(() => import('../games/JeopardyRebuilding'));
const AmazingRaceCrossroadsLazy = React.lazy(() => import('../games/AmazingRaceCrossroads'));

type RootStackParamList = {
  Splash: undefined;
  OriginStory: undefined;
  CoupleCode: undefined;
  PartnerEntry: undefined;
  LegalDisclaimer: undefined;
  AuthSignIn: undefined;
  AuthReset: undefined;
  SOSBooths: undefined;
  SOSCoolDown: { fightId: string };
  SOSVerdict: { fightId: string; timeout?: boolean };
  Dashboard: undefined;
  PartnerTranslator: undefined;
  Profile: undefined;
  PartnerDashboard: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  Support: undefined;
  AdminPortal: undefined;
  GameLibrary: undefined;
  ChallengeScreen: { title: string; duration?: number; type?: string };
  ResultsRoast: { result: any; verdict?: any };
  PlayTruthOrTrust: { gameId: string };
  PlayApologyAuction: { gameId: string };
  PlayGratitudeCloud: { gameId: string };
  PlayEyeContactChallenge: { gameId: string };
  PlayMemoryLaneMap: { gameId: string };
  PlaySlapOfTruth: { gameId: string };
  PlayDefensivenessDetox: { gameId: string };
  PlayWhosRight: { gameId: string };
  PlayStressTest: { gameId: string };
  PlayRoleSwapRoast: { gameId: string };
  PlayWindowsAndWalls: { gameId: string };
  PlayTriggerTriage: { gameId: string };
  PlayTrustBank: { gameId: string };
  PlayTheIceberg: { gameId: string };
  PlaySecrecyAudit: { gameId: string };
  PlayLieDetector: { gameId: string };
  PlayTransparencyToss: { gameId: string };
  PlayBoundaryBingo: { gameId: string };
  PlayVibeSync: { gameId: string };
  PlayRewriteMemory: { gameId: string };
  PlayGuiltShameSort: { gameId: string };
  PlayFlashbackFrenzy: { gameId: string };
  PlayDenialDetector: { gameId: string };
  PlayVulnerabilityVolley: { gameId: string };
  PlayTouchMap: { gameId: string };
  PlayAvoidanceArcade: { gameId: string };
  PlayNeedsDecoder: { gameId: string };
  PlayEscapismRoom: { gameId: string };
  PlayBlameFlip: { gameId: string };
  PlayMicroBetrayalGolf: { gameId: string };
  PlayBidRadar: { gameId: string };
  PlayGentleStartUpGauntlet: { gameId: string };
  PlayLoveMapSpeedrun: { gameId: string };
  PlayAntidoteArena: { gameId: string };
  PlayMirrorMode: { gameId: string };
  PlayDreamDecoder: { gameId: string };
  PlayToneShiftChallenge: { gameId: string };
  PlayRitualBuilder: { gameId: string };
  PlayConflictDice: { gameId: string };
  PlayAppreciationAuction: { gameId: string };
  PlayFloodingForecast: { gameId: string };
  PlayLoveMapGapQuest: { gameId: string };
  PlaySharedMeaningMural: { gameId: string };
  PlayTextToneTranslator: { gameId: string };
  PlayRepairRelay: { gameId: string };
  PlaySoundtrackSync: { gameId: string };
  PlayMicroMomentMuseum: { gameId: string };
  PlayStressSynergyLab: { gameId: string };
  PlayDreamSupportSprint: { gameId: string };
  PlayTurningTowardTally: { gameId: string };
  PlayCommitmentDice: { gameId: string };
  PlayEmpathyEcho: { gameId: string };
  PlayCompromiseJenga: { gameId: string };
  PlayRitualRoulette: { gameId: string };
  PlayRoleSwap: { gameId: string };
  PlayMemoryLaneDash: { gameId: string };
  PlayAdmirationAim: { gameId: string };
  PlayVowRemix: { gameId: string };
  PlayLegacyDice: { gameId: string };
  PlayConnectionConundrum: { gameId: string };
  PlayTriggerTakedown: { gameId: string };
  PlaySixSecondStareDown: { gameId: string };
  PlayGratitudeGraffiti: { gameId: string };
  PlayMemoryLaneGPS: { gameId: string };
  PlaySixSecondKiss: { gameId: string };
  PlayForeplayForecast: { gameId: string };
  PlayRansomNoteRomance: { gameId: string };
  PlayGifTheFeels: { gameId: string };
  PlayKaraokeConfessional: { gameId: string };
  PlayDateNightRoulette: { gameId: string };
  PlayRepairReportCard: { gameId: string };
  PlayHealingBingo: { gameId: string };
  PlayTheIcebergDive: { gameId: string };
  PlayCommitmentCountdown: { gameId: string };
  PlayApologyOlympics: { gameId: string };
  PlayTruthTellerTower: { gameId: string };
  PlayEscapeEchoChamber: { gameId: string };
  PlayIntimacyFeud: { gameId: string };
  PlayRelationalJeopardy: { gameId: string };
  PlayFamilyFeudNewReality: { gameId: string };
  PlayNewlywedGame: { gameId: string };
  PlayChoppedFamily: { gameId: string };
  PlayLegacyDash: { gameId: string };
  PlayBPDPatternDetective: { gameId: string };
  PlayValidationGameShow: { gameId: string };
  PlayConnectionConstructor: { gameId: string };
  PlayHarborMasterChallenge: { gameId: string };
  PlayTruthTransparencyGauntlet: { gameId: string };
  PlayTimelineDetective: { gameId: string };
  PlayLayersOfHurt: { gameId: string };
  PlayTrustBingo: { gameId: string };
  PlayFutureCouncil: { gameId: string };
  PlayDeEscalationLab: { gameId: string };
  PlayCycleBreaker: { gameId: string };
  PlayApologyWorkshop: { gameId: string };
  PlayTrustWiring: { gameId: string };
  PlayRelationshipCouncil: { gameId: string };
  PlayDealOrNoDealAccountability: { gameId: string };
  PlayFamilyFeudSafety: { gameId: string };
  PlayNewlywedHeart: { gameId: string };
  PlayJeopardyRebuilding: { gameId: string };
  PlayAmazingRaceCrossroads: { gameId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.backgroundPrimary }}>
      <ActivityIndicator color={COLORS.vibrantPink} />
    </View>
  );
}

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      ChallengeScreen: 'challenge/:title',
      PartnerTranslator: 'translator',
    }
  }
};

export default function OnboardingNavigator() {
  return (
    <ErrorBoundary>
      <Provider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: COLORS.backgroundPrimary } }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="OriginStory" component={Origin} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="CoupleCode" component={CoupleCode} options={{ animation: 'slide_from_bottom' }} />

            <Stack.Screen name="LegalDisclaimer" component={LegalDisclaimer} />
            <Stack.Screen name="AuthSignIn" component={AuthSignIn} />
            <Stack.Screen name="AuthReset" component={AuthReset} />
            <Stack.Screen name="SOSBooths" component={Booths} options={{ animation: 'none' }} />
            <Stack.Screen name="SOSCoolDown" component={CoolDown} options={{ animation: 'none' }} />
            <Stack.Screen name="SOSVerdict" component={Verdict} options={{ animation: 'fade' }} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="PartnerTranslator" component={PartnerTranslator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="AdminPortal" component={AdminPortal} />
            <Stack.Screen name="GameLibrary" component={GameLibrary} />
            <Stack.Screen name="ChallengeScreen" component={ChallengeScreen} />
            <Stack.Screen name="ResultsRoast" component={ResultsRoast} />
            <Stack.Screen name="PlayTruthOrTrust" component={TruthOrTrustScreen} />
            <Stack.Screen name="PlayApologyAuction" component={ApologyAuctionScreen} />
            <Stack.Screen name="PlayGratitudeCloud" component={GratitudeCloudScreen} />
            <Stack.Screen name="PlayEyeContactChallenge" component={EyeContactChallengeScreen} />
            <Stack.Screen name="PlayMemoryLaneMap" component={MemoryLaneMapScreen} />
            <Stack.Screen name="PlaySlapOfTruth" component={SlapOfTruthScreen} />
            <Stack.Screen name="PlayDefensivenessDetox" component={DefensivenessDetoxScreen} />
            <Stack.Screen name="PlayWhosRight" component={WhosRightScreen} />
            <Stack.Screen name="PlayStressTest" component={StressTestScreen} />
            <Stack.Screen name="PlayRoleSwapRoast" component={RoleSwapRoastScreen} />
            <Stack.Screen name="PlayWindowsAndWalls" component={WindowsAndWallsScreen} />
            <Stack.Screen name="PlayTriggerTriage" component={TriggerTriageScreen} />
            <Stack.Screen name="PlayTrustBank" component={TrustBankScreen} />
            <Stack.Screen name="PlayTheIceberg" component={TheIcebergScreen} />
            <Stack.Screen name="PlaySecrecyAudit" component={SecrecyAuditScreen} />
            <Stack.Screen name="PlayLieDetector" component={LieDetectorScreen} />
            <Stack.Screen name="PlayTransparencyToss" component={TransparencyTossScreen} />
            <Stack.Screen name="PlayBoundaryBingo" component={BoundaryBingoScreen} />
            <Stack.Screen name="PlayVibeSync" component={VibeSyncScreen} />
            <Stack.Screen name="PlayRewriteMemory" component={RewriteMemoryScreen} />
            <Stack.Screen name="PlayGuiltShameSort" component={GuiltShameSortScreen} />
            <Stack.Screen name="PlayFlashbackFrenzy" component={FlashbackFrenzyScreen} />
            <Stack.Screen name="PlayDenialDetector" component={DenialDetectorScreen} />
            <Stack.Screen name="PlayVulnerabilityVolley" component={VulnerabilityVolleyScreen} />
            <Stack.Screen name="PlayTouchMap" component={TouchMapScreen} />
            <Stack.Screen name="PlayAvoidanceArcade" component={AvoidanceArcadeScreen} />
            <Stack.Screen name="PlayNeedsDecoder" component={NeedsDecoderScreen} />
            <Stack.Screen name="PlayEscapismRoom" component={EscapismRoomScreen} />
            <Stack.Screen name="PlayBlameFlip" component={BlameFlipScreen} />
            <Stack.Screen name="PlayMicroBetrayalGolf" component={MicroBetrayalGolfScreen} />
            <Stack.Screen name="PlayBidRadar" component={BidRadarScreen} />
            <Stack.Screen name="PlayGentleStartUpGauntlet" component={GentleStartUpGauntletScreen} />
            <Stack.Screen name="PlayLoveMapSpeedrun" component={LoveMapSpeedrunScreen} />
            <Stack.Screen name="PlayAntidoteArena" component={AntidoteArenaScreen} />
            <Stack.Screen name="PlayMirrorMode" component={MirrorModeScreen} />
            <Stack.Screen name="PlayDreamDecoder" component={DreamDecoderScreen} />
            <Stack.Screen name="PlayToneShiftChallenge" component={ToneShiftChallengeScreen} />
            <Stack.Screen name="PlayRitualBuilder" component={RitualBuilderScreen} />
            <Stack.Screen name="PlayConflictDice" component={ConflictDiceScreen} />
            <Stack.Screen name="PlayAppreciationAuction" component={AppreciationAuctionScreen} />
            <Stack.Screen name="PlayFloodingForecast" component={FloodingForecastScreen} />
            <Stack.Screen name="PlayLoveMapGapQuest" component={LoveMapGapQuestScreen} />
            <Stack.Screen name="PlaySharedMeaningMural" component={SharedMeaningMuralScreen} />
            <Stack.Screen name="PlayTextToneTranslator" component={TextToneTranslatorScreen} />
            <Stack.Screen name="PlayRepairRelay" component={RepairRelayScreen} />
            <Stack.Screen name="PlaySoundtrackSync" component={SoundtrackSyncScreen} />
            <Stack.Screen name="PlayMicroMomentMuseum" component={MicroMomentMuseumScreen} />
            <Stack.Screen name="PlayStressSynergyLab" component={StressSynergyLabScreen} />
            <Stack.Screen name="PlayDreamSupportSprint" component={DreamSupportSprintScreen} />
            <Stack.Screen name="PlayTurningTowardTally" component={TurningTowardTallyScreen} />
            <Stack.Screen name="PlayCommitmentDice" component={CommitmentDiceScreen} />
            <Stack.Screen name="PlayEmpathyEcho" component={EmpathyEchoScreen} />
            <Stack.Screen name="PlayCompromiseJenga" component={CompromiseJengaScreen} />
            <Stack.Screen name="PlayRitualRoulette" component={RitualRouletteScreen} />
            <Stack.Screen name="PlayRoleSwap" component={RoleSwapScreen} />
            <Stack.Screen name="PlayMemoryLaneDash" component={MemoryLaneDashScreen} />
            <Stack.Screen name="PlayAdmirationAim" component={AdmirationAimScreen} />
            <Stack.Screen name="PlayVowRemix" component={VowRemixScreen} />
            <Stack.Screen name="PlayLegacyDice" component={LegacyDiceScreen} />
            <Stack.Screen name="PlayConnectionConundrum" component={ConnectionConundrumScreen} />
            <Stack.Screen name="PlayTriggerTakedown" component={TriggerTakedownScreen} />
            <Stack.Screen name="PlaySixSecondStareDown" component={SixSecondStareDownScreen} />
            <Stack.Screen name="PlayGratitudeGraffiti" component={GratitudeGraffitiScreen} />
            <Stack.Screen name="PlayMemoryLaneGPS" component={MemoryLaneGPSScreen} />
            <Stack.Screen name="PlaySixSecondKiss" component={SixSecondKissScreen} />
            <Stack.Screen name="PlayForeplayForecast" component={ForeplayForecastScreen} />
            <Stack.Screen name="PlayRansomNoteRomance" component={RansomNoteRomanceScreen} />
            <Stack.Screen name="PlayGifTheFeels" component={GifTheFeelsScreen} />
            <Stack.Screen name="PlayKaraokeConfessional" component={KaraokeConfessionalScreen} />
            <Stack.Screen name="PlayDateNightRoulette" component={DateNightRouletteScreen} />
            <Stack.Screen name="PlayRepairReportCard" component={RepairReportCardScreen} />
            <Stack.Screen name="PlayHealingBingo" component={HealingBingoScreen} />
            <Stack.Screen name="PlayTheIcebergDive" component={TheIcebergDiveScreen} />
            <Stack.Screen name="PlayCommitmentCountdown" component={CommitmentCountdownScreen} />
            <Stack.Screen name="PlayApologyOlympics" component={ApologyOlympicsScreen} />
            <Stack.Screen name="PlayTruthTellerTower" component={TruthTellerTowerScreen} />
            <Stack.Screen name="PlayEscapeEchoChamber" component={EscapeEchoChamberScreen} />
            <Stack.Screen name="PlayIntimacyFeud" component={IntimacyFeudScreen} />
            <Stack.Screen name="PlayRelationalJeopardy" component={RelationalJeopardyScreen} />
            <Stack.Screen name="PlayFamilyFeudNewReality" component={FamilyFeudNewRealityScreen} />
            <Stack.Screen name="PlayNewlywedGame" component={NewlywedGameScreen} />
            <Stack.Screen name="PlayChoppedFamily" component={ChoppedFamilyScreen} />
            <Stack.Screen name="PlayLegacyDash" component={LegacyDashScreen} />
            <Stack.Screen name="PlayBPDPatternDetective" component={BPDPatternDetectiveScreen} />
            <Stack.Screen name="PlayValidationGameShow" component={ValidationGameShowScreen} />
            <Stack.Screen name="PlayConnectionConstructor" component={ConnectionConstructorScreen} />
            <Stack.Screen name="PlayHarborMasterChallenge" component={HarborMasterChallengeScreen} />
            {/* Phoenix Protocol */}
            <Stack.Screen name="PlayTruthTransparencyGauntlet" component={TruthTransparencyGauntletScreen} />
            <Stack.Screen name="PlayTimelineDetective" component={TimelineDetectiveScreen} />
            <Stack.Screen name="PlayLayersOfHurt" component={LayersOfHurtScreen} />
            <Stack.Screen name="PlayTrustBingo" component={TrustBingoScreen} />
            <Stack.Screen name="PlayFutureCouncil" component={FutureCouncilScreen} />
            {/* Trust Renovation */}
            <Stack.Screen name="PlayDeEscalationLab" component={DeEscalationLabScreen} />
            <Stack.Screen name="PlayCycleBreaker" component={CycleBreakerScreen} />
            <Stack.Screen name="PlayApologyWorkshop" component={ApologyWorkshopScreen} />
            <Stack.Screen name="PlayTrustWiring" component={TrustWiringScreen} />
            <Stack.Screen name="PlayRelationshipCouncil" component={RelationshipCouncilScreen} />
            {/* Word-Wound */}
            <Stack.Screen name="PlayDealOrNoDealAccountability" component={DealOrNoDealAccountabilityScreen} />
            <Stack.Screen name="PlayFamilyFeudSafety" component={FamilyFeudSafetyScreen} />
            <Stack.Screen name="PlayNewlywedHeart" component={NewlywedHeartScreen} />
            <Stack.Screen name="PlayJeopardyRebuilding" component={JeopardyRebuildingScreen} />
            <Stack.Screen name="PlayAmazingRaceCrossroads" component={AmazingRaceCrossroadsScreen} />
          </Stack.Navigator>
          <SOSButton onPress={() => navigate('SOSBooths')} />
          <FeedbackFab />
          <PreviewOverlay />
          <MarcieOverlay visible={true} />
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
}

function Splash({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SplashScreenLazy onStart={() => navigation.replace('OriginStory')} onLogin={() => navigation.navigate('AuthSignIn')} />
    </Suspense>
  );
}

function LieDetectorScreen(props: any) { return <Suspense fallback={<Loader />}><LieDetectorLazy {...props} /></Suspense>; }
function TransparencyTossScreen(props: any) { return <Suspense fallback={<Loader />}><TransparencyTossLazy {...props} /></Suspense>; }
function BoundaryBingoScreen(props: any) { return <Suspense fallback={<Loader />}><BoundaryBingoLazy {...props} /></Suspense>; }
function VibeSyncScreen(props: any) { return <Suspense fallback={<Loader />}><VibeSyncLazy {...props} /></Suspense>; }
function RewriteMemoryScreen(props: any) { return <Suspense fallback={<Loader />}><RewriteMemoryLazy {...props} /></Suspense>; }
function GuiltShameSortScreen(props: any) { return <Suspense fallback={<Loader />}><GuiltShameSortLazy {...props} /></Suspense>; }
function FlashbackFrenzyScreen(props: any) { return <Suspense fallback={<Loader />}><FlashbackFrenzyLazy {...props} /></Suspense>; }
function DenialDetectorScreen(props: any) { return <Suspense fallback={<Loader />}><DenialDetectorLazy {...props} /></Suspense>; }
function VulnerabilityVolleyScreen(props: any) { return <Suspense fallback={<Loader />}><VulnerabilityVolleyLazy {...props} /></Suspense>; }
function TouchMapScreen(props: any) { return <Suspense fallback={<Loader />}><TouchMapLazy {...props} /></Suspense>; }
function AvoidanceArcadeScreen(props: any) { return <Suspense fallback={<Loader />}><AvoidanceArcadeLazy {...props} /></Suspense>; }
function NeedsDecoderScreen(props: any) { return <Suspense fallback={<Loader />}><NeedsDecoderLazy {...props} /></Suspense>; }
function EscapismRoomScreen(props: any) { return <Suspense fallback={<Loader />}><EscapismRoomLazy {...props} /></Suspense>; }
function BlameFlipScreen(props: any) { return <Suspense fallback={<Loader />}><BlameFlipLazy {...props} /></Suspense>; }
function MicroBetrayalGolfScreen(props: any) { return <Suspense fallback={<Loader />}><MicroBetrayalGolfLazy {...props} /></Suspense>; }
function BidRadarScreen(props: any) { return <Suspense fallback={<Loader />}><BidRadarLazy {...props} /></Suspense>; }
function GentleStartUpGauntletScreen(props: any) { return <Suspense fallback={<Loader />}><GentleStartUpGauntletLazy {...props} /></Suspense>; }
function LoveMapSpeedrunScreen(props: any) { return <Suspense fallback={<Loader />}><LoveMapSpeedrunLazy {...props} /></Suspense>; }
function AntidoteArenaScreen(props: any) { return <Suspense fallback={<Loader />}><AntidoteArenaLazy {...props} /></Suspense>; }
function MirrorModeScreen(props: any) { return <Suspense fallback={<Loader />}><MirrorModeLazy {...props} /></Suspense>; }
function DreamDecoderScreen(props: any) { return <Suspense fallback={<Loader />}><DreamDecoderLazy {...props} /></Suspense>; }
function ToneShiftChallengeScreen(props: any) { return <Suspense fallback={<Loader />}><ToneShiftChallengeLazy {...props} /></Suspense>; }
function RitualBuilderScreen(props: any) { return <Suspense fallback={<Loader />}><RitualBuilderLazy {...props} /></Suspense>; }
function ConflictDiceScreen(props: any) { return <Suspense fallback={<Loader />}><ConflictDiceLazy {...props} /></Suspense>; }
function AppreciationAuctionScreen(props: any) { return <Suspense fallback={<Loader />}><AppreciationAuctionLazy {...props} /></Suspense>; }
function FloodingForecastScreen(props: any) { return <Suspense fallback={<Loader />}><FloodingForecastLazy {...props} /></Suspense>; }
function LoveMapGapQuestScreen(props: any) { return <Suspense fallback={<Loader />}><LoveMapGapQuestLazy {...props} /></Suspense>; }
function SharedMeaningMuralScreen(props: any) { return <Suspense fallback={<Loader />}><SharedMeaningMuralLazy {...props} /></Suspense>; }
function TextToneTranslatorScreen(props: any) { return <Suspense fallback={<Loader />}><TextToneTranslatorLazy {...props} /></Suspense>; }
function RepairRelayScreen(props: any) { return <Suspense fallback={<Loader />}><RepairRelayLazy {...props} /></Suspense>; }
function SoundtrackSyncScreen(props: any) { return <Suspense fallback={<Loader />}><SoundtrackSyncLazy {...props} /></Suspense>; }
function MicroMomentMuseumScreen(props: any) { return <Suspense fallback={<Loader />}><MicroMomentMuseumLazy {...props} /></Suspense>; }
function StressSynergyLabScreen(props: any) { return <Suspense fallback={<Loader />}><StressSynergyLabLazy {...props} /></Suspense>; }
function DreamSupportSprintScreen(props: any) { return <Suspense fallback={<Loader />}><DreamSupportSprintLazy {...props} /></Suspense>; }
function TurningTowardTallyScreen(props: any) { return <Suspense fallback={<Loader />}><TurningTowardTallyLazy {...props} /></Suspense>; }
function CommitmentDiceScreen(props: any) { return <Suspense fallback={<Loader />}><CommitmentDiceLazy {...props} /></Suspense>; }
function EmpathyEchoScreen(props: any) { return <Suspense fallback={<Loader />}><EmpathyEchoLazy {...props} /></Suspense>; }
function CompromiseJengaScreen(props: any) { return <Suspense fallback={<Loader />}><CompromiseJengaLazy {...props} /></Suspense>; }
function RitualRouletteScreen(props: any) { return <Suspense fallback={<Loader />}><RitualRouletteLazy {...props} /></Suspense>; }
function RoleSwapScreen(props: any) { return <Suspense fallback={<Loader />}><RoleSwapLazy {...props} /></Suspense>; }
function MemoryLaneDashScreen(props: any) { return <Suspense fallback={<Loader />}><MemoryLaneDashLazy {...props} /></Suspense>; }
function AdmirationAimScreen(props: any) { return <Suspense fallback={<Loader />}><AdmirationAimLazy {...props} /></Suspense>; }
function VowRemixScreen(props: any) { return <Suspense fallback={<Loader />}><VowRemixLazy {...props} /></Suspense>; }
function LegacyDiceScreen(props: any) { return <Suspense fallback={<Loader />}><LegacyDiceLazy {...props} /></Suspense>; }
function ConnectionConundrumScreen(props: any) { return <Suspense fallback={<Loader />}><ConnectionConundrumLazy {...props} /></Suspense>; }

function Origin({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <OriginStoryScreenLazy onComplete={() => navigation.replace('CoupleCode')} />
    </Suspense>
  );
}

function CoupleCode({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <CoupleCodeScreenLazy onNext={() => navigation.replace('LegalDisclaimer')} />
    </Suspense>
  );
}

function AuthSignIn({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SignInScreenLazy onAuthenticated={() => navigation.replace('LegalDisclaimer')} onForgot={() => navigation.navigate('AuthReset')} />
    </Suspense>
  );
}

function AuthReset({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PasswordResetScreenLazy onSent={() => navigation.goBack()} />
    </Suspense>
  );
}

function PartnerEntry({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerEntryScreenLazy onLinked={() => navigation.replace('LegalDisclaimer')} />
    </Suspense>
  );
}
function LegalDisclaimer({ navigation }: any) {
  return (
    <Suspense fallback={<Loader />}>
      <LegalDisclaimerScreenLazy onContinue={() => navigation.replace('Dashboard')} />
    </Suspense>
  );
}

function Booths(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <BoothsScreenLazy {...props} />
    </Suspense>
  );
}

function CoolDown(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <CoolDownRoomLazy {...props} />
    </Suspense>
  );
}

function Verdict(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <VerdictScreenLazy {...props} />
    </Suspense>
  );
}

function Dashboard(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardHomeLazy {...props} />
    </Suspense>
  );
}

function PartnerTranslator(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerTranslatorLazy {...props} />
    </Suspense>
  );
}

function Profile(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ProfileScreenLazy {...props} />
    </Suspense>
  );
}

function PartnerDashboard(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <PartnerDashboardLazy {...props} />
    </Suspense>
  );
}

function Leaderboard(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <LeaderboardScreenLazy {...props} />
    </Suspense>
  );
}

function Settings(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SettingsScreenLazy {...props} />
    </Suspense>
  );
}

function Support(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SupportScreenLazy {...props} />
    </Suspense>
  );
}

function AdminPortal(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <AdminPortalLazy {...props} />
    </Suspense>
  );
}

function GameLibrary(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <GameLibraryScreenLazy {...props} />
    </Suspense>
  );
}

function ChallengeScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ChallengeScreenLazy {...props} />
    </Suspense>
  );
}

function ResultsRoast(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ResultsRoastLazy {...props} />
    </Suspense>
  );
}

function WindowsAndWallsScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <WindowsAndWallsLazy {...props} />
    </Suspense>
  );
}

function TriggerTriageScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TriggerTriageLazy {...props} />
    </Suspense>
  );
}

function TrustBankScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TrustBankLazy {...props} />
    </Suspense>
  );
}

function TheIcebergScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TheIcebergLazy {...props} />
    </Suspense>
  );
}

function SecrecyAuditScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SecrecyAuditLazy {...props} />
    </Suspense>
  );
}

function TruthOrTrustScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <TruthOrTrustLazy {...props} />
    </Suspense>
  );
}

function ApologyAuctionScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ApologyAuctionLazy {...props} />
    </Suspense>
  );
}

function GratitudeCloudScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <GratitudeCloudLazy {...props} />
    </Suspense>
  );
}

function EyeContactChallengeScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <EyeContactChallengeLazy {...props} />
    </Suspense>
  );
}

function MemoryLaneMapScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <MemoryLaneMapLazy {...props} />
    </Suspense>
  );
}

function SlapOfTruthScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <SlapOfTruthLazy {...props} />
    </Suspense>
  );
}

function DefensivenessDetoxScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <DefensivenessDetoxLazy {...props} />
    </Suspense>
  );
}

function WhosRightScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <WhosRightLazy {...props} />
    </Suspense>
  );
}

function StressTestScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <StressTestLazy {...props} />
    </Suspense>
  );
}

function RoleSwapRoastScreen(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <RoleSwapRoastLazy {...props} />
    </Suspense>
  );
}
function TriggerTakedownScreen(props: any) { return <Suspense fallback={<Loader />}><TriggerTakedownLazy {...props} /></Suspense>; }
function SixSecondStareDownScreen(props: any) { return <Suspense fallback={<Loader />}><SixSecondStareDownLazy {...props} /></Suspense>; }
function GratitudeGraffitiScreen(props: any) { return <Suspense fallback={<Loader />}><GratitudeGraffitiLazy {...props} /></Suspense>; }
function MemoryLaneGPSScreen(props: any) { return <Suspense fallback={<Loader />}><MemoryLaneGPSLazy {...props} /></Suspense>; }
function SixSecondKissScreen(props: any) { return <Suspense fallback={<Loader />}><SixSecondKissLazy {...props} /></Suspense>; }
function ForeplayForecastScreen(props: any) { return <Suspense fallback={<Loader />}><ForeplayForecastLazy {...props} /></Suspense>; }
function RansomNoteRomanceScreen(props: any) { return <Suspense fallback={<Loader />}><RansomNoteRomanceLazy {...props} /></Suspense>; }
function GifTheFeelsScreen(props: any) { return <Suspense fallback={<Loader />}><GifTheFeelsLazy {...props} /></Suspense>; }
function KaraokeConfessionalScreen(props: any) { return <Suspense fallback={<Loader />}><KaraokeConfessionalLazy {...props} /></Suspense>; }
function DateNightRouletteScreen(props: any) { return <Suspense fallback={<Loader />}><DateNightRouletteLazy {...props} /></Suspense>; }
function RepairReportCardScreen(props: any) { return <Suspense fallback={<Loader />}><RepairReportCardLazy {...props} /></Suspense>; }
function HealingBingoScreen(props: any) { return <Suspense fallback={<Loader />}><HealingBingoLazy {...props} /></Suspense>; }
function TheIcebergDiveScreen(props: any) { return <Suspense fallback={<Loader />}><TheIcebergDiveLazy {...props} /></Suspense>; }
function CommitmentCountdownScreen(props: any) { return <Suspense fallback={<Loader />}><CommitmentCountdownLazy {...props} /></Suspense>; }
function ApologyOlympicsScreen(props: any) { return <Suspense fallback={<Loader />}><ApologyOlympicsLazy {...props} /></Suspense>; }
function TruthTellerTowerScreen(props: any) { return <Suspense fallback={<Loader />}><TruthTellerTowerLazy {...props} /></Suspense>; }
function EscapeEchoChamberScreen(props: any) { return <Suspense fallback={<Loader />}><EscapeEchoChamberLazy {...props} /></Suspense>; }
function IntimacyFeudScreen(props: any) { return <Suspense fallback={<Loader />}><IntimacyFeudLazy {...props} /></Suspense>; }
function RelationalJeopardyScreen(props: any) { return <Suspense fallback={<Loader />}><RelationalJeopardyLazy {...props} /></Suspense>; }
function FamilyFeudNewRealityScreen(props: any) { return <Suspense fallback={<Loader />}><FamilyFeudNewRealityLazy {...props} /></Suspense>; }
function NewlywedGameScreen(props: any) { return <Suspense fallback={<Loader />}><NewlywedGameLazy {...props} /></Suspense>; }
function ChoppedFamilyScreen(props: any) { return <Suspense fallback={<Loader />}><ChoppedFamilyLazy {...props} /></Suspense>; }
function LegacyDashScreen(props: any) { return <Suspense fallback={<Loader />}><LegacyDashLazy {...props} /></Suspense>; }
function BPDPatternDetectiveScreen(props: any) { return <Suspense fallback={<Loader />}><BPDPatternDetectiveLazy {...props} /></Suspense>; }
function ValidationGameShowScreen(props: any) { return <Suspense fallback={<Loader />}><ValidationGameShowLazy {...props} /></Suspense>; }
function ConnectionConstructorScreen(props: any) { return <Suspense fallback={<Loader />}><ConnectionConstructorLazy {...props} /></Suspense>; }
function HarborMasterChallengeScreen(props: any) { return <Suspense fallback={<Loader />}><HarborMasterChallengeLazy {...props} /></Suspense>; }
const TruthTransparencyGauntletScreen = (props: any) => <Suspense fallback={<Loader />}><TruthTransparencyGauntletLazy {...props} /></Suspense>;
const TimelineDetectiveScreen = (props: any) => <Suspense fallback={<Loader />}><TimelineDetectiveLazy {...props} /></Suspense>;
const LayersOfHurtScreen = (props: any) => <Suspense fallback={<Loader />}><LayersOfHurtLazy {...props} /></Suspense>;
const TrustBingoScreen = (props: any) => <Suspense fallback={<Loader />}><TrustBingoLazy {...props} /></Suspense>;
const FutureCouncilScreen = (props: any) => <Suspense fallback={<Loader />}><FutureCouncilLazy {...props} /></Suspense>;
const DeEscalationLabScreen = (props: any) => <Suspense fallback={<Loader />}><DeEscalationLabLazy {...props} /></Suspense>;
const CycleBreakerScreen = (props: any) => <Suspense fallback={<Loader />}><CycleBreakerLazy {...props} /></Suspense>;
const ApologyWorkshopScreen = (props: any) => <Suspense fallback={<Loader />}><ApologyWorkshopLazy {...props} /></Suspense>;
const TrustWiringScreen = (props: any) => <Suspense fallback={<Loader />}><TrustWiringLazy {...props} /></Suspense>;
const RelationshipCouncilScreen = (props: any) => <Suspense fallback={<Loader />}><RelationshipCouncilLazy {...props} /></Suspense>;
const DealOrNoDealAccountabilityScreen = (props: any) => <Suspense fallback={<Loader />}><DealOrNoDealAccountabilityLazy {...props} /></Suspense>;
const FamilyFeudSafetyScreen = (props: any) => <Suspense fallback={<Loader />}><FamilyFeudSafetyLazy {...props} /></Suspense>;
const NewlywedHeartScreen = (props: any) => <Suspense fallback={<Loader />}><NewlywedHeartLazy {...props} /></Suspense>;
const JeopardyRebuildingScreen = (props: any) => <Suspense fallback={<Loader />}><JeopardyRebuildingLazy {...props} /></Suspense>;
const AmazingRaceCrossroadsScreen = (props: any) => <Suspense fallback={<Loader />}><AmazingRaceCrossroadsLazy {...props} /></Suspense>;
