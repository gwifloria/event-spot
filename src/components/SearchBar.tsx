import { useState, useMemo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getColors } from "../constants/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  placeholder = "Search events...",
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const [isFocused, setIsFocused] = useState(false);
  const animatedScale = useMemo(() => new Animated.Value(1), []);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(animatedScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: c.backgroundSecondary,
          borderColor: isFocused ? c.text : "transparent",
          transform: [{ scale: animatedScale }],
        },
      ]}
    >
      <Feather
        name="search"
        size={18}
        color={isFocused ? c.text : c.textTertiary}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={c.textTertiary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <View style={[styles.clearIcon, { backgroundColor: c.textTertiary }]}>
            <Feather name="x" size={12} color={c.backgroundSecondary} />
          </View>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
});
