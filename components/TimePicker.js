// components/TimePicker.js
import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import useTheme from '../hooks/useTheme';

export default function TimePicker({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  const { colors } = useTheme();

  const handleChange = (event, selectedTime) => {
    setShow(false);
    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          paddingVertical: 14,
          borderRadius: 10,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.background, fontWeight: '600' }}>
          {label}: {format(value, 'h:mm a')}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
