import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  color: string;
  category: string;
}

interface FaqCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const FaqItemComponent = ({ 
  item, 
  isOpen, 
  onToggle 
}: { 
  item: FaqItem; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  return (
    <GlassCard style={styles.faqItemContainer} padding="none">
      <SquishyButton 
        variant="ghost"
        style={styles.faqQuestionRow}
        onPress={onToggle}
      >
        <View style={styles.faqIconContainer}>
          <Typography variant="h3" style={[styles.faqIcon, { color: item.color }]}>
            {item.icon}
          </Typography>
        </View>
        <Typography variant="body" style={styles.faqQuestion} numberOfLines={2}>
          {item.question}
        </Typography>
        <Typography variant="body" style={[
          styles.faqToggle,
          isOpen && styles.faqToggleOpen
        ]}>
          {isOpen ? '▲' : '▼'}
        </Typography>
      </SquishyButton>
      
      {isOpen && (
        <View style={styles.faqAnswerContainer}>
          <Typography variant="body" style={styles.faqAnswer}>{item.answer}</Typography>
        </View>
      )}
    </GlassCard>
  );
};

const HelpAndFaqScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // FAQ categories from Design Bible
  const categories: FaqCategory[] = [
    { id: 'all', name: 'All', icon: '🌟', color: COLORS.accentViolet },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', color: COLORS.accentTeal },
    { id: 'account', name: 'Account', icon: '👤', color: COLORS.accentPink },
    { id: 'games', name: 'Games', icon: '🎮', color: COLORS.accentOrange },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧', color: COLORS.accentYellow },
    { id: 'billing', name: 'Billing', icon: '💳', color: COLORS.accentRose },
  ];

  // FAQ data matching Design Bible specifications
  const faqData: FaqItem[] = [
    {
      id: '1',
      question: 'HOW TO LINK YOUR PARTNER?',
      answer: 'Linking your partner is easy! Go to Settings > Profile > Link Partner. You will receive a unique cosmic code to share with your partner. Once they enter this code, you\'ll be connected and can start playing together. Make sure both of you have verified email addresses for the connection to work properly.',
      icon: '🔗',
      color: COLORS.accentPink,
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'WHAT IS SOS MODE?',
      answer: 'SOS Mode is a specialized de-escalation tool designed for high-tension moments. It offers structured communication prompts, breathing exercises, and guided conflict resolution. Access it anytime by tapping the SOS button on your home screen. The mode provides private booths for each partner to express feelings safely before coming together for resolution.',
      icon: '🆘',
      color: COLORS.accentYellow,
      category: 'games'
    },
    {
      id: '3',
      question: 'WHY AREN\'T OUR DAILY QUESTS SYNCING?',
      answer: 'Ensure both users are on the latest app version and connected to a stable network. If the issue persists, try restarting the app and checking your partner connection status. Sometimes logging out and back in can resolve sync issues. Make sure both partners have completed the onboarding process.',
      icon: '🔄',
      color: COLORS.accentTeal,
      category: 'troubleshooting'
    },
    {
      id: '4',
      question: 'HOW DOES THE TRUST THERMOMETER WORK?',
      answer: 'The Trust Thermometer measures your relationship health based on game completion, communication quality, and consistency. It updates in real-time as you play games and interact with your partner. Higher trust levels unlock premium content and special achievements. The thermometer is influenced by both individual and collaborative activities.',
      icon: '🌡️',
      color: COLORS.innerLineStart,
      category: 'games'
    },
    {
      id: '5',
      question: 'CAN I CHANGE MY DR. MARCIE PERSONALITY LEVEL?',
      answer: 'Yes! Go to Settings > Dr. Marcie Personality to adjust her sarcasm and directness levels. You can choose from 4 levels: Tough Love Rookie, Reality Check Specialist, Radical Truth Wizard, or The Glamour Oracle. Your choice affects her dialogue style and the intensity of her feedback throughout the app.',
      icon: '👩‍⚕️',
      color: COLORS.accentRose,
      category: 'account'
    },
    {
      id: '6',
      question: 'WHAT HAPPENS TO MY DATA IF I DELETE MY ACCOUNT?',
      answer: 'When you delete your account, all personal data, game progress, and partner connections are permanently removed within 30 days. You can request a data export before deletion. Some anonymized usage data may be retained for analytics purposes. Your partner will be notified of the account deletion.',
      icon: '🗑️',
      color: COLORS.accentOrange,
      category: 'account'
    },
    {
      id: '7',
      question: 'HOW DO I UPGRADE TO PREMIUM?',
      answer: 'Tap the crown icon in the top right corner of your home screen, or go to Settings > Subscription. Premium unlocks all games, removes ads, provides advanced analytics, and includes priority support. You can choose monthly or annual billing, with a 7-day free trial for new users.',
      icon: '👑',
      color: COLORS.accentYellow,
      category: 'billing'
    },
    {
      id: '8',
      question: 'WHY CAN\'T I ACCESS CERTAIN GAMES?',
      answer: 'Some games are premium-only and require a subscription. Others may be locked until you reach certain trust levels or complete prerequisite games. Check the game requirements by tapping on the locked game card. Your current trust level and subscription status determine available content.',
      icon: '🔒',
      color: COLORS.accentViolet,
      category: 'games'
    }
  ];

  // Filter FAQ items based on search and category
  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (faqId: string) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@lovetrae.com';
    const subject = 'LoveTrae Support Request';
    const body = 'Please describe your issue or question:\n\n';
    
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then(supported => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Contact Support',
          `Please email us at ${supportEmail}`,
          [{ text: 'OK' }]
        );
      }
    });
  };

  const handleChatPress = () => {
    // In a real app, this would open a chat interface
    Alert.alert(
      'Live Chat',
      'Live chat support is coming soon! For now, please email us.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenLayout showHeader={false}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title} center>
            HELP & FAQ
          </Typography>
          <Typography variant="body" style={styles.subtitle} center>
            Find answers in the stars. Our cosmic support guide is here to help.
          </Typography>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH FOR ANSWERS..."
            placeholderTextColor={COLORS.textHint}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map(category => (
            <SquishyButton
              key={category.id}
              variant={selectedCategory === category.name ? 'primary' : 'ghost'}
              size="small"
              onPress={() => setSelectedCategory(category.name)}
            >
              <Typography variant="h3" style={[
                styles.categoryIcon,
                { color: category.color }
              ]}>
                {category.icon}
              </Typography>
              <Typography variant="caption" style={[
                styles.categoryText,
                selectedCategory === category.name && styles.activeCategoryText
              ]}>
                {category.name}
              </Typography>
            </SquishyButton>
          ))}
        </ScrollView>

        {/* FAQ Items */}
        <View style={styles.faqsContainer}>
          {filteredFaqs.map(faq => (
            <FaqItemComponent
              key={faq.id}
              item={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => handleFaqToggle(faq.id)}
            />
          ))}
        </View>

        {/* Contact Support Section */}
        <GlassCard style={styles.contactSection}>
          <Typography variant="title" style={styles.contactTitle} center>
            STILL ORBITING THE ANSWER?
          </Typography>
          <Typography variant="body" style={styles.contactSubtitle} center>
            Our support team is active 24/7.
          </Typography>
          <SquishyButton onPress={handleContactSupport}>
            <Typography variant="button">EMAIL SUPPORT</Typography>
          </SquishyButton>
        </GlassCard>
      </ScrollView>

      {/* Floating Chat Button */}
      <SquishyButton
        style={styles.chatButton}
        onPress={handleChatPress}
      >
        <Typography variant="h2" style={styles.chatButtonText}>💬</Typography>
      </SquishyButton>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: SPACING.xxl,
  },
  
  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    maxWidth: 300,
    alignSelf: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xlarge,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  searchInput: {
    ...TYPOGRAPHY.fontFamily.regular,
    flex: 1,
    color: COLORS.textPrimary,
    height: SPACING.xxlarge + SPACING.md,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    textTransform: 'uppercase',
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
  },
  
  // Category Filter
  categoryContainer: {
    maxHeight: SPACING.xxlarge * 2,
    marginBottom: SPACING.lg,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
  },
  categoryIcon: {
    fontSize: TYPOGRAPHY.fontSize.headerSmall,
    marginRight: SPACING.xs,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  activeCategoryText: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  
  // FAQ Items
  faqsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  faqItemContainer: {
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    minHeight: SPACING.xxlarge + SPACING.md,
  },
  faqIconContainer: {
    marginRight: SPACING.sm,
  },
  faqIcon: {},
  faqQuestion: {
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
    flex: 1,
    flexWrap: 'wrap',
  },
  faqToggle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    marginLeft: SPACING.sm,
  },
  faqToggleOpen: {
    color: COLORS.primaryGradientStart,
  },
  faqAnswerContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: 0,
  },
  faqAnswer: {
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  
  // Contact Section
  contactSection: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  contactTitle: {
    marginBottom: SPACING.xs,
  },
  contactSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  
  // Floating Chat Button
  chatButton: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: SPACING.xxlarge * 2,
    height: SPACING.xxlarge * 2,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.large,
  },
  chatButtonText: {},
});

export default HelpAndFaqScreen;
