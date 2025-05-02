// components/ModalCard.js
import React from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import useTheme from '../hooks/useTheme';

export default function ModalCard({
  isVisible,
  onClose,
  children,
  contentStyle = {},
  backdropOpacity = 0.3,
}) {
  const { colors } = useTheme();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={backdropOpacity}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
    >
      <TouchableWithoutFeedback>
        <View style={[styles.inner, { backgroundColor: colors.card }, contentStyle]}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  inner: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
