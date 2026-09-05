import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const ResourceCard = ({ title, description, contact, contactType, color, icon }: any) => (
  <GlassCard style={styles.resourceCard}>
    <View style={[styles.resourceIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <Typography variant="h4" style={styles.resourceTitle}>{title}</Typography>
    <Typography variant="body" style={styles.resourceDescription}>{description}</Typography>
    <View style={styles.resourceFooter}>
      <Typography variant="small" style={[styles.contactText, { color }]}>{contact}</Typography>
    </View>
    <SquishyButton
      onPress={() => {}}
      variant="primary"
      size="medium"
      style={[styles.contactButton, { backgroundColor: color }]}
    >
      {contactType}
    </SquishyButton>
  </GlassCard>
);

const CrisisResourcesScreen = () => {
  const menuItems = [
    { label: 'Safety Plan', active: false },
    { label: 'National Hotlines', active: true },
    { label: 'Chat Services', active: false },
    { label: 'Local Support', active: false },
  ];

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Your safety is the priority. Help is available.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Typography variant="h1" style={styles.headerTitle}>Immediate Help</Typography>
            <Typography variant="body" style={styles.headerSubtitle}>
              If you or your partner are in immediate danger, please use these verified resources. 
              Your safety is the priority.
            </Typography>
          </View>

          {/* Safety Exit Button */}
          <SquishyButton 
            onPress={() => {}}
            variant="ghost"
            size="medium"
            style={styles.safetyExitButton}
          >
            <View style={styles.safetyExitContent}>
              <Ionicons name="exit-outline" size={20} color={COLORS.error} />
              <Typography variant="body" style={styles.safetyExitText}>SAFETY EXIT</Typography>
            </View>
          </SquishyButton>

          {/* Mobile Menu */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuScroll}
          >
            {menuItems.map((item, index) => (
              <SquishyButton 
                key={index}
                onPress={() => {}}
                variant={item.active ? "primary" : "ghost"}
                size="small"
                style={[styles.menuItem, item.active && styles.activeMenuItem]}
              >
                <Typography 
                  variant="small" 
                  style={[styles.menuText, item.active && styles.activeMenuText]}
                >
                  {item.label}
                </Typography>
              </SquishyButton>
            ))}
          </ScrollView>

          {/* Featured Resource */}
          <GlassCard style={styles.featuredResource}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredIconContainer}>
                <Ionicons name="call" size={32} color={COLORS.vibrantPink} />
              </View>
              <View style={styles.featuredTextContainer}>
                <Typography variant="h3" style={styles.featuredTitle}>
                  988 Suicide & Crisis Lifeline
                </Typography>
                <Typography variant="body" style={styles.featuredDescription}>
                  Free, confidential support available 24/7.
                </Typography>
              </View>
            </View>
            <SquishyButton
              onPress={() => Linking.openURL('tel:988')}
              variant="primary"
              size="large"
              style={styles.featuredButton}
            >
              Call 988
            </SquishyButton>
          </GlassCard>

          {/* Resource Cards */}
          <View style={styles.resourcesContainer}>
            <ResourceCard 
              title="Domestic Violence Hotline"
              description="Safety planning and crisis intervention available 24/7."
              contact="1-800-799-7233"
              contactType="Call Now"
              color={COLORS.vibrantPink}
              icon="shield-outline"
            />
            <ResourceCard 
              title="Crisis Text Line"
              description="Connect with a volunteer Crisis Counselor anytime."
              contact="Text HOME to 741741"
              contactType="Text Now"
              color={COLORS.lavenderPurple}
              icon="chatbubble-ellipses-outline"
            />
          </View>

          {/* Additional Info */}
          <GlassCard style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.info} style={styles.infoIcon} />
            <Typography variant="body" style={styles.infoText}>
              These resources are confidential and free. You don't have to go through this alone.
            </Typography>
          </GlassCard>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.textPrimary}15`,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  safetyExitButton: {
    backgroundColor: `${COLORS.error}15`,
    borderColor: `${COLORS.error}30`,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  safetyExitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  safetyExitText: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  menuScroll: {
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  menuItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: `${COLORS.richPlum}80`,
    marginRight: SPACING.sm,
  },
  activeMenuItem: {
    backgroundColor: `${COLORS.vibrantPink}20`,
    borderWidth: 1,
    borderColor: `${COLORS.vibrantPink}40`,
  },
  menuText: {
    color: COLORS.textSecondary,
  },
  activeMenuText: {
    color: COLORS.vibrantPink,
  },
  featuredResource: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  featuredIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: `${COLORS.vibrantPink}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    marginBottom: SPACING.xs,
  },
  featuredDescription: {
    opacity: 0.7,
  },
  featuredButton: {
    width: '100%',
  },
  resourcesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  resourceCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  resourceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  resourceTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  resourceDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  resourceFooter: {
    marginBottom: SPACING.md,
  },
  contactText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactButton: {
    width: '100%',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default CrisisResourcesScreen;
