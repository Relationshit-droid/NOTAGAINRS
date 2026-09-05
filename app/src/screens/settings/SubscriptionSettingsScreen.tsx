import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function SubscriptionSettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [subscription, setSubscription] = useState({
    plan: 'free', // 'free', 'premium', 'beta'
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2025-09-15',
    paymentMethod: 'Apple Pay',
    autoRenew: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      // In real app, fetch from backend
      setSubscription(prev => ({ ...prev, plan: 'premium', status: 'active' }));
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user, userId]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '/month',
      features: [
        'Access to 10+ games',
        'Basic trust thermometer',
        'Weekly reports',
        'Partner linking',
        'SOS Fight Solver (basic)',
      ],
      color: COLORS.textSecondary,
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: '/month',
      features: [
        'All 167 games unlocked',
        'Advanced analytics dashboard',
        'Personalized game recommendations',
        'Dr. Marcie voice (premium voices)',
        'Unlimited SOS sessions',
        'Streak protection',
        'Priority support',
        'Romance Hub full access',
        'Weekly relationship report (detailed)',
        'Export data anytime',
      ],
      color: COLORS.vibrantPink,
      popular: true,
    },
    {
      id: 'beta',
      name: 'Beta Access',
      price: 14.99,
      period: '/month',
      features: [
        'Everything in Premium',
        'Early access to new games',
        'Direct feedback to Dr. Marcie',
        'Custom game requests',
        'Beta features first',
        'Exclusive community access',
        'Quarterly 1-on-1 with team',
      ],
      color: COLORS.brightYellow,
      popular: false,
    },
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading subscription...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Plan */}
        <GlassCard style={[styles.currentPlanCard, { borderColor: getPlanColor(subscription.plan) }]} variant="elevated">
          <View style={styles.currentPlanHeader}>
            <View style={styles.planBadge}>
              <Typography variant="label" style={{ color: COLORS.textPrimary }}>{subscription.plan.toUpperCase()}</Typography>
              {subscription.plan !== 'free' && <Typography variant="caption" style={styles.planStatus}>{subscription.status}</Typography>}
            </View>
            <View style={styles.planPrice}>
              <Typography variant="gameTitle" style={{ color: getPlanColor(subscription.plan) }}>${subscription.price || 0}</Typography>
              <Typography variant="caption" style={styles.planPeriod}>{subscription.billingCycle}</Typography>
            </View>
          </View>
          
          <View style={styles.currentPlanDetails}>
            <View style={styles.detailItem}>
              <Typography variant="caption" style={styles.detailLabel}>Next Billing</Typography>
              <Typography variant="body" style={styles.detailValue}>{subscription.nextBillingDate}</Typography>
            </View>
            <View style={styles.detailItem}>
              <Typography variant="caption" style={styles.detailLabel}>Payment Method</Typography>
              <Typography variant="body" style={styles.detailValue}>{subscription.paymentMethod}</Typography>
            </View>
            <View style={styles.detailItem}>
              <Typography variant="caption" style={styles.detailLabel}>Auto-renew</Typography>
              <Typography variant="body" style={styles.detailValue}>{subscription.autoRenew ? 'Enabled' : 'Disabled'}</Typography>
            </View>
          </View>

          {subscription.plan !== 'free' && (
            <SquishyButton 
              variant="ghost"
              onPress={() => { /* Manage subscription */ }}
              style={styles.manageButton}
            >
              <Ionicons name="settings" size={18} color={COLORS.textSecondary} style={{ marginRight: SPACING.small }} />
              <Typography variant="button" color={COLORS.textSecondary}>MANAGE SUBSCRIPTION</Typography>
            </SquishyButton>
          )}
        </GlassCard>

        {/* Plans Comparison */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>CHOOSE YOUR PLAN</Typography>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plansContainer}>
            {plans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} current={subscription.plan === plan.id} index={index} />
            ))}
          </ScrollView>
        </GlassCard>

        {/* Billing History */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>BILLING HISTORY</Typography>
          
          <View style={styles.historyList}>
            {[
              { date: 'Aug 15, 2025', amount: '$9.99', status: 'Paid', plan: 'Premium' },
              { date: 'Jul 15, 2025', amount: '$9.99', status: 'Paid', plan: 'Premium' },
              { date: 'Jun 15, 2025', amount: '$9.99', status: 'Paid', plan: 'Premium' },
              { date: 'May 15, 2025', amount: '$0.00', status: 'Free Trial', plan: 'Free' },
            ].map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyInfo}>
                  <Typography variant="label" style={styles.historyPlan}>{item.plan}</Typography>
                  <Typography variant="caption" style={styles.historyDate}>{item.date}</Typography>
                </View>
                <View style={styles.historyAmount}>
                  <Typography variant="header" style={{ color: item.status === 'Paid' ? COLORS.mintGreen : COLORS.textSecondary }}>
                    {item.amount}
                  </Typography>
                  <Typography variant="caption" style={styles.historyStatus}>{item.status}</Typography>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Restore Purchases */}
        <SquishyButton 
          variant="secondary"
          onPress={() => { /* Restore purchases */ }}
          style={styles.restoreButton}
        >
          <Ionicons name="refresh" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">RESTORE PURCHASES</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const PlanCard = ({ plan, current, index }: any) => (
  <TouchableOpacity style={[
    styles.planCard,
    current && styles.planCardCurrent,
    { borderColor: plan.color },
  ]}>
    {plan.popular && (
      <View style={styles.popularBadge}>
        <Typography variant="caption" color={COLORS.textPrimary}>MOST POPULAR</Typography>
      </View>
    )}
    <View style={styles.planHeader}>
      <Typography variant="header" style={styles.planName}>{plan.name}</Typography>
      <View style={styles.planPrice}>
        <Typography variant="gameTitle" style={{ color: plan.color }}>${plan.price}</Typography>
        <Typography variant="caption" style={styles.planPeriod}>{plan.period}</Typography>
      </View>
    </View>
    <View style={styles.planFeatures}>
      {plan.features.map((feature: string, i: number) => (
        <View key={i} style={styles.featureItem}>
          <Ionicons name="checkmark" size={14} color={plan.color} style={styles.featureIcon} />
          <Typography variant="caption" style={styles.featureText}>{feature}</Typography>
        </View>
      ))}
    </View>
    <SquishyButton 
      onPress={() => { /* Select plan */ }}
      variant={current ? 'ghost' : 'primary'}
      style={styles.planButton}
      disabled={current}
    >
      <Typography variant="button" style={{ color: current ? plan.color : COLORS.textPrimary }}>
        {current ? 'CURRENT PLAN' : 'SELECT'}
      </Typography>
    </SquishyButton>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  currentPlanCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
    borderWidth: 2,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xlarge,
  },
  planBadge: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink + '20',
  },
  planStatus: {
    color: COLORS.mintGreen,
    marginTop: SPACING.tiny,
  },
  currentPlanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
    paddingTop: SPACING.xlarge,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.textHint,
    fontSize: 11,
    marginBottom: SPACING.tiny,
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  manageButton: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  plansContainer: {
    gap: SPACING.regular,
    paddingHorizontal: SPACING.tiny,
  },
  planCard: {
    width: 280,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    overflow: 'hidden',
  },
  planCardCurrent: {
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: SPACING.regular,
    right: SPACING.regular,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    zIndex: 10,
  },
  planHeader: {
    padding: SPACING.large,
    paddingBottom: 0,
  },
  planName: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
  },
  planPrice: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  planPeriod: {
    color: COLORS.textHint,
    marginTop: -4,
  },
  planFeatures: {
    padding: SPACING.large,
    paddingTop: 0,
    gap: SPACING.regular,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.small,
  },
  featureIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  featureText: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  planButton: {
    margin: SPACING.large,
    marginTop: SPACING.regular,
  },
  historyList: {
    gap: SPACING.regular,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlan: {
    marginBottom: SPACING.tiny,
  },
  historyDate: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  historyAmount: {
    alignItems: 'flex-end',
  },
  historyStatus: {
    color: COLORS.textHint,
    fontSize: 11,
    marginTop: SPACING.tiny,
  },
});

function getPlanColor(plan: string) {
  const colors: Record<string, string> = {
    free: COLORS.textSecondary,
    premium: COLORS.vibrantPink,
    beta: COLORS.brightYellow,
  };
  return colors[plan] || COLORS.vibrantPink;
}