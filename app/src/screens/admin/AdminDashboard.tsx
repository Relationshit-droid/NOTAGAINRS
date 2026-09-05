
import React from "react";
import { View, StyleSheet } from "react-native";
import { ScreenLayout } from "../../layout";
import { Typography, SquishyButton } from "../../components/ui";
import { COLORS, SPACING } from "../../theme";

const AdminDashboard = ({ navigation }) => {
  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <View style={styles.container}>
        <Typography variant="h1" color={COLORS.textPrimary} style={{ marginBottom: SPACING.xlarge }}>
          Admin Dashboard
        </Typography>
        <SquishyButton
          onPress={() => navigation.navigate("AdminAnalytics")}
          style={{ marginBottom: SPACING.regular }}
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            View Analytics
          </Typography>
        </SquishyButton>
        <SquishyButton
          onPress={() => navigation.navigate("AdminFightModeration")}
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            Moderate Fights
          </Typography>
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminDashboard;
