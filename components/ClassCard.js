import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import TimePicker from "./TimePicker";

export default function ClassCard({
  label,
  startTime,
  endTime,
  onLabelChange,
  onTimePress,
  tiltAnim,
  entranceAnim,
  boxPulse,
  width,
}) {
  const { colors } = useTheme();
  const ITEM_WIDTH = width * 0.92;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width: ITEM_WIDTH,
          backgroundColor: colors.card,
          transform: [
            { rotateY: tiltAnim || "0deg" },
            {
              translateY: entranceAnim
                ? entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  })
                : 0,
            },
          ],
          opacity: entranceAnim || 1,
        },
      ]}
    >
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        Enter your class name
      </Text>

      <Animated.View
        style={[styles.inputWrapper, { transform: [{ scale: boxPulse || 1 }] }]}
      >
        <TextInput
          value={label}
          onChangeText={onLabelChange}
          placeholder="Class Name"
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholderTextColor={colors.border}
        />
        <Ionicons
          name="pencil"
          size={20}
          color={colors.border}
          style={styles.inlineIcon}
        />
      </Animated.View>

      <View style={styles.timeRow}>
        <TimePicker
          label="Start"
          value={startTime}
          onChange={(newTime) => onTimePress("start", newTime)}
        />
        <TimePicker
          label="End"
          value={endTime}
          onChange={(newTime) => onTimePress("end", newTime)}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 72,
    height: 460,
    justifyContent: "center",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  inputWrapper: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "600",
  },
  inlineIcon: {
    position: "absolute",
    right: 20,
    top: 12,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
});
