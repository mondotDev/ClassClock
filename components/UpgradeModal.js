// components/UpgradeModal.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalCard from './ModalCard';
import AppButton from './AppButton';
import useTheme from '../hooks/useTheme';

export default function UpgradeModal({ isVisible, onClose, onUpgrade }) {
  const theme = useTheme();

  return (
    <ModalCard isVisible={isVisible} onClose={onClose}>
      <View style={styles.iconRow}>
        <Ionicons name="star-outline" size={36} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Go Pro</Text>
      </View>

      <Text style={[styles.body, { color: theme.colors.text }]}>
        Unlock unlimited schedules, future syncing features, and help support continued development.
      </Text>

      <AppButton title="Upgrade to Pro" onPress={onUpgrade} style={styles.button} />
      <AppButton title="Maybe Later" onPress={onClose} style={[styles.button, { backgroundColor: '#aaa' }]} />
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});
