
import React from "react";
import { View } from "react-native";
import { ScreenLayout } from "../../layout";
import { Typography } from "../../components/ui";
import { COLORS } from "../../theme";

const AdminAnalytics = () => {
  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h1" color={COLORS.textPrimary}>
          Admin Analytics
        </Typography>
        {/* Add charts and data visualizations here */}
      </View>
    </ScreenLayout>
  );
};

export default AdminAnalytics;
