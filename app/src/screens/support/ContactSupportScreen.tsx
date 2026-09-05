import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const ContactSupportScreen = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const categories = ['Technical Issue', 'Billing', 'Feature Request', 'General Inquiry'];

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Need a hand, partner? I'm here to help.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headingContainer}>
            <Typography variant="h1" style={styles.headingTitle}>
              Need a hand, partner?
            </Typography>
            <Typography variant="body" style={styles.headingSubtitle}>
              Our support crew is ready to help you navigate your journey.
            </Typography>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.formGroup}>
              <Typography variant="label" style={styles.label}>Subject</Typography>
              <TextInput
                placeholder="Briefly describe your issue"
                placeholderTextColor={COLORS.textHint}
                value={subject}
                onChangeText={setSubject}
                style={styles.textInput}
              />
            </View>

            <View style={styles.formGroup}>
              <Typography variant="label" style={styles.label}>Category</Typography>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <SquishyButton
                    key={cat}
                    onPress={() => setCategory(cat)}
                    variant={category === cat ? "primary" : "ghost"}
                    size="small"
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive
                    ]}
                  >
                    <Typography 
                      variant="small" 
                      style={[
                        styles.categoryText,
                        category === cat && styles.categoryTextActive
                      ]}
                    >
                      {cat}
                    </Typography>
                  </SquishyButton>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Typography variant="label" style={styles.label}>Message</Typography>
              <TextInput
                placeholder="Tell us more about what's happening..."
                placeholderTextColor={COLORS.textHint}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                style={styles.textArea}
              />
            </View>

            <SquishyButton 
              onPress={() => {}}
              variant="primary"
              size="large"
              style={styles.submitButton}
            >
              Submit Ticket
            </SquishyButton>

            <View style={styles.responseTimeIndicator}>
              <Ionicons name="time-outline" size={16} color={COLORS.warning} />
              <Typography variant="small" style={styles.indicatorText}>
                Average Response Time: 2h
              </Typography>
            </View>
          </GlassCard>
          
          <View style={styles.footerLinks}>
            <SquishyButton 
              onPress={() => {}}
              variant="ghost"
              size="medium"
              style={styles.linkButton}
            >
              <View style={styles.linkContent}>
                <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} />
                <Typography variant="body" style={styles.linkText}>Knowledge Base</Typography>
              </View>
            </SquishyButton>
            <SquishyButton 
              onPress={() => {}}
              variant="ghost"
              size="medium"
              style={styles.linkButton}
            >
              <View style={styles.linkContent}>
                <Ionicons name="people-outline" size={20} color={COLORS.textSecondary} />
                <Typography variant="body" style={styles.linkText}>Community Forums</Typography>
              </View>
            </SquishyButton>
          </View>
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
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  headingTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  headingSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  formCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.sm,
  },
  textInput: {
    height: 48,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    backgroundColor: `${COLORS.richPlum}80`,
    borderWidth: 1,
    borderColor: `${COLORS.textPrimary}10`,
  },
  categoryButtonActive: {
    backgroundColor: `${COLORS.vibrantPink}20`,
    borderColor: COLORS.vibrantPink,
  },
  categoryText: {
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  responseTimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLORS.warning}15`,
    borderColor: `${COLORS.warning}30`,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xlarge,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.xs,
  },
  indicatorText: {
    color: COLORS.warning,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  linkButton: {
    padding: SPACING.md,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  linkText: {
    textDecorationLine: 'underline',
    opacity: 0.7,
  },
});

export default ContactSupportScreen;
