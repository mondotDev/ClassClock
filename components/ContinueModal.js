import React from 'react';
import { View, Text } from 'react-native';
import ModalCard from './ModalCard';
import AppButton from './AppButton';

export default function ContinueModal({
  visible,
  onCancel,
  onContinue,
  title,
  message,
  colors,
  disabled,
}) {
  return (
    <ModalCard isVisible={visible} onClose={onCancel}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 12,
          color: colors.text,
        }}
      >
        {title}
      </Text>
      <Text style={{ color: colors.text, marginBottom: 20 }}>{message}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppButton
          title="Cancel"
          style={{ flex: 1, marginRight: 8 }}
          onPress={onCancel}
        />
        <AppButton
          title="Continue"
          style={{ flex: 1 }}
          onPress={onContinue}
          disabled={disabled}
        />
      </View>
    </ModalCard>
  );
}
