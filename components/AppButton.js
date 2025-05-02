// components/AppButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../hooks/useTheme';

export default function AppButton({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  variant = 'primary', // 🔥 default variant
}) {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: theme.colors.secondary,
          text: theme.colors.text,
        };
      case 'danger':
        return {
          background: '#D32F2F', // nice red
          text: '#FFF',
        };
      case 'primary':
      default:
        return {
          background: theme.colors.primary,
          text: '#FFF',
        };
    }
  };

  const { background, text } = getColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#999' : background },
        style,
      ]}
    >
      <Text style={[
        styles.text,
        { color: text },
        textStyle,
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
