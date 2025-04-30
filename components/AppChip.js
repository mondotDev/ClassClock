import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

export default function AppChip({ label, selected, onPress }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primary
            : theme.colors.card,
          borderColor: selected
            ? theme.colors.primary
            : theme.colors.border,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? "#fff" : theme.colors.text,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
});
