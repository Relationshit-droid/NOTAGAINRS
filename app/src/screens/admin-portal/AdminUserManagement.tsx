
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import ScreenLayout from '../../layout/ScreenLayout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <GlassCard style={styles.userItem} variant="elevated" padding="medium">
      <Typography variant="body" color={COLORS.textPrimary}>UID: {item.id}</Typography>
      <Typography variant="body" color={COLORS.textSecondary}>Trust: {item.trust_thermometer}</Typography>
      <Typography variant="body" color={COLORS.textSecondary}>Subscription: {item.subscription_status || 'N/A'}</Typography>
    </GlassCard>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" style={styles.title}>User Management</Typography>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    marginBottom: SPACING.regular,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xlarge,
  },
  userItem: {
    marginBottom: SPACING.regular,
  },
});

export default AdminUserManagement;
