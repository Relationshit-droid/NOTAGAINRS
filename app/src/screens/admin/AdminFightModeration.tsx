
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ScreenLayout } from "../../layout";
import { Typography, SquishyButton, GlassCard } from "../../components/ui";
import { COLORS, SPACING } from "../../theme";

type ModeratedFight = {
  id: string;
  user1: string;
  user2: string;
  issue: string;
};

const AdminFightModeration = ({ fights }: { fights: ModeratedFight[] }) => {

  const renderItem = ({ item }: { item: ModeratedFight }) => (
    <GlassCard style={styles.fightCard}>
      <Typography variant="h3" color={COLORS.textPrimary}>
        {item.user1} vs {item.user2}
      </Typography>
      <Typography variant="body" color={COLORS.textSecondary}>
        {item.issue}
      </Typography>
      <View style={styles.buttonRow}>
        <SquishyButton
          onPress={() => {}}
          variant="primary"
          size="small"
          style={{ marginRight: SPACING.regular }}
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            Approve
          </Typography>
        </SquishyButton>
        <SquishyButton
          onPress={() => {}}
          variant="secondary"
          size="small"
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            Deny
          </Typography>
        </SquishyButton>
      </View>
    </GlassCard>
  );

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <Typography variant="h1" color={COLORS.textPrimary} center style={{ marginBottom: SPACING.regular }}>
        Fight Moderation
      </Typography>
      <FlatList
        data={fights}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  fightCard: {
    marginBottom: SPACING.regular,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.regular,
  },
});

export default AdminFightModeration;
