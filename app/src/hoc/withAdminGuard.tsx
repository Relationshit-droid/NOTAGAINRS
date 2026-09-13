import React from 'react';
import { useAppStore } from '../state/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export function withAdminGuard<P extends object>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const isAdmin = useAppStore(state => state.user?.role === 'admin');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    React.useEffect(() => {
      if (!isAdmin) {
        navigation.replace('Home');
      }
    }, [isAdmin, navigation]);

    if (!isAdmin) {
      return null;
    }

    return <Component {...props} />;
  };
}