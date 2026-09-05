import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated as RNAnimated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { userApi, coupleApi, gamesApi, User, Couple, GameCategory } from '../lib/api';
import { auth } from '../lib/firebaseClient';

import TrustThermometer from '../components/ui/TrustThermometer';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, ANIMATIONS, SHADOWS } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(SPACING.xxlarge)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATIONS.duration.normal,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATIONS.duration.normal,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <RNAnimated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </RNAnimated.View>
  );
};

const AvatarWithRing = ({ 
  imageUrl, 
  size = SPACING.xxxlarge + SPACING.large, 
  isOnline = false 
}: { 
  imageUrl?: string; 
  size?: number;
  isOnline?: boolean;
}) => {
  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <LinearGradient
        colors={COLORS.connection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.avatarRing,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      
      <View
        style={[
          styles.avatarInner,
          { 
            width: size - SPACING.tiny, 
            height: size - SPACING.tiny, 
            borderRadius: (size - SPACING.tiny) / 2,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%', borderRadius: (size - SPACING.tiny) / 2 }}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: COLORS.midPurple }]}>
            <Typography variant="h3" color={COLORS.textPrimary}>?</Typography>
          </View>
        )}
      </View>
      
      {isOnline && (
        <View style={[styles.onlineIndicator, { right: SPACING.tiny, bottom: SPACING.tiny }]} />
      )}
    </View>
  );
};

const DailyQuestCard = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassCard variant="elevated" style={styles.dailyQuestCard} padding="none">
        <LinearGradient
          colors={[COLORS.richPlum, COLORS.backgroundCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.dailyQuestContent}>
          <View style={styles.dailyQuestHeader}>
            <View style={styles.dailyQuestIcon}>
              <Typography variant="h3" center>⭐</Typography>
            </View>
            <View style={styles.dailyQuestText}>
              <Typography variant="label" color={COLORS.textPrimary}>DAILY QUEST</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>Complete to earn rewards</Typography>
            </View>
          </View>
          
          <View style={styles.questProgress}>
            <View style={styles.questProgressBar}>
              <LinearGradient
                colors={COLORS.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.questProgressFill, { width: '60%' }]}
              />
            </View>
            <Typography variant="caption" color={COLORS.textSecondary}>3/5 completed</Typography>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const TabItem = ({ 
  icon, 
  label, 
  isActive = false, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  isActive?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    style={[styles.tabItem, isActive && styles.tabItemActive]} 
    onPress={onPress}
  >
    <Typography variant="body" color={isActive ? COLORS.textPrimary : COLORS.textSecondary} center>{icon}</Typography>
    <Typography 
      variant="caption" 
      color={isActive ? COLORS.vibrantPink : COLORS.textSecondary} 
      center
      style={{ marginTop: SPACING.tiny }}
    >
      {label}
    </Typography>
    {isActive && <View style={styles.tabIndicator} />}
  </TouchableOpacity>
);

const SOSButton = ({ onPress }: { onPress?: () => void }) => {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        styles.sosButtonContainer,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <SquishyButton onPress={onPress} style={styles.sosButton}>
        <Typography variant="label" color={COLORS.textPrimary}>SOS</Typography>
      </SquishyButton>
    </RNAnimated.View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const token = await currentUser.getIdToken();

        // Create-or-get: a Firebase user who has never synced to the backend
        // will 404 on get(); create the record instead of failing.
        let userData;
        try {
          userData = await userApi.get(currentUser.uid, token);
        } catch (err: any) {
          if (err?.statusCode === 404) {
            userData = await userApi.create(
              {
                email: currentUser.email!,
                display_name: currentUser.displayName || currentUser.email!.split('@')[0],
              },
              token
            );
          } else {
            throw err;
          }
        }
        setUser(userData);
        console.log('✅ User data fetched from backend:', userData.display_name);

        if (userData.couple_id) {
          try {
            const coupleData = await coupleApi.get(userData.couple_id, token);
            setCouple(coupleData);
            console.log('✅ Couple data fetched from backend');
          } catch (coupleErr) {
            console.error('Failed to fetch couple data:', coupleErr);
          }
        }

        const categoriesData = await gamesApi.getCategories();
        setCategories(categoriesData.categories);
        console.log(`✅ ${categoriesData.categories.length} game categories fetched from backend`);

      } catch (err: any) {
        console.error('❌ Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        
        Alert.alert(
          'Connection Error',
          'Could not connect to the game server. Please try again.',
          [{ text: 'Retry', onPress: fetchData }, { text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryPress = (category: GameCategory) => {
    navigation.navigate('GameLibrary', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleLinkPartner = () => {
    navigation.navigate('CoupleLinking');
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <LinearGradient colors={[COLORS.deepCosmic, COLORS.nightSky]} style={styles.background} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.vibrantPink} />
          <Typography variant="body" color={COLORS.textPrimary} style={{ marginTop: SPACING.large }}>
            Loading your love data...
          </Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (error && !user) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <LinearGradient colors={[COLORS.deepCosmic, COLORS.nightSky]} style={styles.background} />
        <View style={styles.centerContent}>
          <Typography variant="h3" color={COLORS.error} center style={{ marginBottom: SPACING.large }}>
            Unable to load data
          </Typography>
          <SquishyButton onPress={() => navigation.navigate('Login')}>
            <Typography variant="button" color={COLORS.textPrimary}>Go to Login</Typography>
          </SquishyButton>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient
        colors={[COLORS.deepCosmic, COLORS.nightSky]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Typography variant="body" color={COLORS.textSecondary}>Welcome back,</Typography>
              <Typography variant="h2" color={COLORS.textPrimary}>{user?.display_name || 'Player'}!</Typography>
            </View>
            <AvatarWithRing size={SPACING.xxxlarge + SPACING.large} isOnline={true} />
          </View>
          
          {couple ? (
            <GlassCard variant="outlined" style={styles.coupleInfo} padding="medium">
              <View style={styles.coupleAvatars}>
                <AvatarWithRing size={SPACING.xxlarge} />
                <View style={styles.connectionLine}>
                  <Typography variant="body">💕</Typography>
                </View>
                <AvatarWithRing size={SPACING.xxlarge} />
              </View>
              <Typography variant="body" color={COLORS.textSecondary}>Connected with partner</Typography>
            </GlassCard>
          ) : (
            <SquishyButton onPress={handleLinkPartner} style={styles.linkButton}>
              <Typography variant="button" color={COLORS.textPrimary}>🔗 Link with Your Partner</Typography>
            </SquishyButton>
          )}
        </View>

        <View style={styles.thermometerSection}>
          <View style={styles.thermometerHeader}>
            <Typography variant="h4" color={COLORS.textPrimary}>Trust Thermometer</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Your relationship health</Typography>
          </View>
          <View style={styles.thermometerContainer}>
            <TrustThermometer
              level={couple?.trust_meter || 0.5}
              width={SPACING.xxlarge + SPACING.large}
              height={SPACING.xxxlarge * 5}
              showPercentage={true}
              weeklyChange={couple?.trust_weekly_change}
            />
          </View>
        </View>

        <View style={styles.questSection}>
          <DailyQuestCard onPress={() => navigation.navigate('DailyQuest')} />
        </View>

        <View style={styles.categoriesSection}>
          <Typography variant="h4" color={COLORS.textPrimary} style={{ marginBottom: SPACING.regular }}>
            Choose Your Adventure
          </Typography>
          
          {categories.map((category, index) => (
            <AnimatedCard key={category.id} delay={index * 100}>
              <TouchableOpacity
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
                <Typography variant="h2">{category.icon}</Typography>
                <View style={styles.categoryInfo}>
                  <Typography variant="h4" color={COLORS.textPrimary}>{category.name}</Typography>
                  <Typography variant="caption" color={COLORS.textSecondary}>{category.description}</Typography>
                  <Typography variant="label" color={COLORS.vibrantPink} style={{ marginTop: SPACING.tiny }}>
                    {category.games.length} games
                  </Typography>
                </View>
                <Typography variant="h4" color={COLORS.textSecondary}>→</Typography>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SOSButton onPress={() => navigation.navigate('SOS')} />

      <View style={styles.tabBar}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <TabItem 
          icon="🏠" 
          label="Home" 
          isActive={activeTab === 'home'}
          onPress={() => setActiveTab('home')}
        />
        <TabItem 
          icon="🎮" 
          label="Games" 
          isActive={activeTab === 'games'}
          onPress={() => setActiveTab('games')}
        />
        <TabItem 
          icon="📊" 
          label="Progress" 
          isActive={activeTab === 'progress'}
          onPress={() => setActiveTab('progress')}
        />
        <View style={styles.tabSpacer} />
        <TabItem 
          icon="🏆" 
          label="Rewards" 
          isActive={activeTab === 'rewards'}
          onPress={() => setActiveTab('rewards')}
        />
        <TabItem 
          icon="💬" 
          label="Chat" 
          isActive={activeTab === 'chat'}
          onPress={() => setActiveTab('chat')}
        />
        <TabItem 
          icon="⚙️" 
          label="Settings" 
          isActive={activeTab === 'settings'}
          onPress={() => setActiveTab('settings')}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  header: {
    padding: SPACING.screenPadding,
    paddingTop: SPACING.large,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    position: 'absolute',
    ...SHADOWS.neonSoft,
  },
  avatarInner: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    width: SPACING.medium + SPACING.tiny,
    height: SPACING.medium + SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.mintGreen,
    borderWidth: SPACING.tiny,
    borderColor: COLORS.deepCosmic,
  },
  coupleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coupleAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  connectionLine: {
    marginHorizontal: SPACING.tiny,
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
  thermometerSection: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  thermometerHeader: {
    marginBottom: SPACING.regular,
  },
  thermometerContainer: {
    alignItems: 'flex-start',
  },
  questSection: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  dailyQuestCard: {
    overflow: 'hidden',
  },
  dailyQuestContent: {
    padding: SPACING.large,
  },
  dailyQuestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  dailyQuestIcon: {
    width: SPACING.xxlarge + SPACING.large,
    height: SPACING.xxlarge + SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.vibrantPink,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  dailyQuestText: {
    flex: 1,
  },
  questProgress: {
    marginTop: SPACING.small,
  },
  questProgressBar: {
    height: SPACING.small,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.small,
  },
  categoriesSection: {
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.xlarge,
    marginBottom: SPACING.regular,
    borderLeftWidth: SPACING.tiny,
    overflow: 'hidden',
  },
  categoryInfo: {
    flex: 1,
    marginHorizontal: SPACING.regular,
  },
  sosButtonContainer: {
    position: 'absolute',
    right: SPACING.screenPadding,
    bottom: SPACING.xxxlarge * 3,
    zIndex: 100,
  },
  sosButton: {
    width: SPACING.xxxlarge + SPACING.large,
    height: SPACING.xxxlarge + SPACING.large,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.neonStrong,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: SPACING.xxxlarge + SPACING.xxlarge,
    paddingBottom: SPACING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.xxlarge + SPACING.large,
  },
  tabItemActive: {
    // Active state styling
  },
  tabIndicator: {
    position: 'absolute',
    bottom: SPACING.small,
    width: SPACING.tiny,
    height: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
  },
  tabSpacer: {
    width: SPACING.xxxlarge + SPACING.large,
  },
  bottomSpacer: {
    height: SPACING.xxxlarge * 3,
  },
});

export default HomeScreen;
