/* eslint-disable react-hooks/refs */
import { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../constants/colors";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

const iconMap: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "close-circle",
  info: "information-circle",
};

const colorMap: Record<ToastType, string> = {
  success: "#10b981",
  error: "#ef4444",
  info: "#6366f1",
};

export function Toast({
  visible,
  message,
  type = "success",
  duration = 2000,
  onHide,
}: ToastProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const insets = useSafeAreaInsets();

  // Animated values - using refs to persist across renders
  const opacityRef = useRef(new Animated.Value(0));
  const translateYRef = useRef(new Animated.Value(-20));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityRef.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYRef.current, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityRef.current, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateYRef.current, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 16,
          backgroundColor: c.backgroundSecondary,
          opacity: opacityRef.current,
          transform: [{ translateY: translateYRef.current }],
        },
      ]}
    >
      <Ionicons name={iconMap[type]} size={20} color={colorMap[type]} />
      <Text style={[styles.message, { color: c.text }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
});
