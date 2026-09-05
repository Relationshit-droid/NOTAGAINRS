import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <View style={styles.sectionContainer} nativeID={id}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionDot} />
      <Typography variant="h3" style={styles.sectionTitle}>{title}</Typography>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const InfoCard = ({ title, text, icon }: { title: string; text: string; icon: any }) => (
  <GlassCard style={styles.infoCard}>
    <Ionicons name={icon} size={24} color={COLORS.vibrantPink} style={styles.infoIcon} />
    <Typography variant="h4" style={styles.infoCardTitle}>{title}</Typography>
    <Typography variant="small" style={styles.infoCardText}>{text}</Typography>
  </GlassCard>
);

const PrivacyPolicyScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const sections = [
    { id: 'intro', title: 'Introduction', icon: 'information-circle' },
    { id: 'collection', title: 'Data Collection', icon: 'cube' },
    { id: 'usage', title: 'Data Usage', icon: 'trending-up' },
    { id: 'sharing', title: 'Sharing', icon: 'people' },
    { id: 'security', title: 'Security', icon: 'shield-checkmark' },
    { id: 'rights', title: 'Your Rights', icon: 'person' },
  ];

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Your privacy is our cosmic priority.">
      <SafeAreaView style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h1" style={styles.mainTitle}>Privacy Policy</Typography>
            <Typography variant="body" style={styles.mainSubtitle}>
              Your intimacy and data security are our priority.
            </Typography>
            <Typography variant="small" style={styles.version}>Version 2.0 • Oct 2023</Typography>
          </View>

          {/* Quick Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navScroll}
          >
            {sections.map((section) => (
              <SquishyButton 
                key={section.id}
                style={styles.navItem}
                onPress={() => {
                  // Scroll to section would go here
                }}
                variant="ghost"
              >
                <Ionicons name={section.icon as any} size={20} color={COLORS.vibrantPink} />
                <Typography variant="small" style={styles.navText}>{section.title}</Typography>
              </SquishyButton>
            ))}
          </ScrollView>

          {/* Sections */}
          <Section id="intro" title="1. Introduction">
            <Typography variant="body" style={styles.paragraph}>
              Welcome to Love Actually... The Game. We are committed to protecting your privacy 
              and providing a safe and secure environment for your therapeutic journey. This 
              Privacy Policy explains how we collect, use, and safeguard the information you provide.
            </Typography>
          </Section>

          <Section id="collection" title="2. Data Collection">
            <Typography variant="body" style={styles.paragraph}>
              We collect information to provide a personalized experience:
            </Typography>
            <View style={styles.listContainer}>
              <Typography variant="body" style={styles.listItem}>• Account Information: Names, emails, credentials.</Typography>
              <Typography variant="body" style={styles.listItem}>• Game Progress: Choices, answers, module completion.</Typography>
              <Typography variant="body" style={styles.listItem}>• Device Metadata: For optimization and crash reporting.</Typography>
            </View>
          </Section>

          <Section id="usage" title="3. Data Usage">
            <Typography variant="body" style={styles.paragraph}>
              Your data is the map to your relationship's galaxy. We use it for:
            </Typography>
            <View style={styles.cardGrid}>
              <InfoCard 
                title="Personalization" 
                text="Tailoring prompts based on your relationship history."
                icon="options"
              />
              <InfoCard 
                title="Progress Tracking" 
                text="Visualizing your growth as a couple."
                icon="analytics"
              />
              <InfoCard 
                title="App Optimization" 
                text="Improving game performance and squashing bugs."
                icon="build"
              />
              <InfoCard 
                title="Legal Compliance" 
                text="Meeting international data protection standards."
                icon="document-text"
              />
            </View>
          </Section>

          <Section id="sharing" title="4. Sharing & Disclosure">
            <Typography variant="body" style={styles.paragraph}>
              We never sell your private therapy data. Disclosure only occurs with your consent, 
              with trusted service providers, or if required by law.
            </Typography>
          </Section>

          <Section id="security" title="5. Security">
            <Typography variant="body" style={styles.paragraph}>
              We use AES-256 bit encryption to ensure your data is secure. Our servers are in 
              Tier-4 data centers with 24/7 monitoring.
            </Typography>
          </Section>

          <Section id="rights" title="6. Your Rights">
            <Typography variant="body" style={styles.paragraph}>
              You have full control over your digital footprint, including the right to access, 
              correct, or delete your data.
            </Typography>
          </Section>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  mainSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  version: {
    opacity: 0.5,
  },
  navScroll: {
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.richPlum}80`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    gap: SPACING.xs,
  },
  navText: {
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.vibrantPink,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    textTransform: 'uppercase',
  },
  sectionContent: {
    marginLeft: SPACING.md,
  },
  paragraph: {
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
    opacity: 0.8,
    marginBottom: SPACING.md,
  },
  listContainer: {
    gap: SPACING.xs,
  },
  listItem: {
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
    opacity: 0.8,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  infoCard: {
    width: '47%',
    alignItems: 'center',
    padding: SPACING.md,
  },
  infoIcon: {
    marginBottom: SPACING.sm,
  },
  infoCardTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  infoCardText: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.bodySmall,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default PrivacyPolicyScreen;
