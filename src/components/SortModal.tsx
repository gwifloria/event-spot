import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, getColors } from "../constants/colors";
import { SORT_OPTIONS } from "../constants/sort";
import type { SortOption } from "../stores/appStore";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function SortModal({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortModalProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const handleSelect = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: c.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: c.text }]}>Sort By</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={c.text} />
            </Pressable>
          </View>

          <View style={styles.list}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = selectedSort === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: isSelected
                        ? c.backgroundSecondary
                        : "transparent",
                    },
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Feather
                    name={option.icon as keyof typeof Feather.glyphMap}
                    size={20}
                    color={isSelected ? colors.primary : c.textSecondary}
                  />
                  <Text style={[styles.optionLabel, { color: c.text }]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  list: {
    padding: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});
