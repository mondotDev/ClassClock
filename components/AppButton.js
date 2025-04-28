// components/AppButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function AppButton({ title, onPress, disabled, style, textColor }) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#999' : theme.colors.primary },
        style,
      ]}
    >
      <Text style={[
        styles.text,
        { color: textColor || theme.colors.background } // 🔥 default white text on blue
      ]}>
        {title}
      </Text>
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
