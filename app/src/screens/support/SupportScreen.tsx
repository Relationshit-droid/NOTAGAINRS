import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="How can I help you today?"
      scrollable={true}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>Support</Typography>
            <Typography variant="body" style={styles.subtitle}>
              Need help? Contact our team or browse FAQs.
            </Typography>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={48} color={COLORS.vibrantPink} />
            </View>
            <Typography variant="h2" style={styles.cardTitle}>Email Support</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              Get personalized help from our support team. We typically respond within 2 hours.
            </Typography>
            <SquishyButton 
              onPress={() => Linking.openURL('mailto:support@lovetrae.app')}
              variant="primary"
              size="large"
            >
              Contact Support
            </SquishyButton>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle-outline" size={48} color={COLORS.info} />
            </View>
            <Typography variant="h2" style={styles.cardTitle}>Help Center</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              Browse our knowledge base for answers to common questions and tutorials.
            </Typography>
            <SquishyButton 
              onPress={() => Linking.openURL('https://example.com/support')}
              variant="secondary"
              size="large"
            >
              Open Help Center
            </SquishyButton>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={COLORS.success} />
            </View>
            <Typography variant="h2" style={styles.cardTitle}>Community</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              Connect with other couples and share experiences in our community forums.
            </Typography>
            <SquishyButton 
              onPress={() => {}}
              variant="ghost"
              size="large"
            >
              Join Community
            </SquishyButton>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: SPACING.xlarge,
    paddingBottom: SPACING.xxxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  iconContainer: {
    marginBottom: SPACING.large,
  },
  cardTitle: {
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  cardDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xl,
  },
});
