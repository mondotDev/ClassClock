// components/AppButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function AppButton({ title, onPress, disabled, style }) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#999' : theme.primary },
        style,
      ]}
    >
      <Text style={[styles.text, { color: theme.buttonText }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
