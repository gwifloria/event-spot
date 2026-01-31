import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, getColors } from "../constants/colors";
import { REGIONS, type Region } from "../constants/regions";

interface RegionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelectRegion: (regionCode: string) => void;
}

export function RegionModal({
  visible,
  onClose,
  selectedRegion,
  onSelectRegion,
}: RegionModalProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const handleSelect = (region: Region) => {
    onSelectRegion(region.code);
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
            <Text style={[styles.title, { color: c.text }]}>Select Region</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={c.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {REGIONS.map((region) => {
              const isSelected = selectedRegion === region.code;
              return (
                <Pressable
                  key={region.code}
                  style={[
                    styles.regionItem,
                    {
                      backgroundColor: isSelected
                        ? c.backgroundSecondary
                        : "transparent",
                    },
                  ]}
                  onPress={() => handleSelect(region)}
                >
                  <Text style={styles.flag}>{region.flag}</Text>
                  <Text style={[styles.regionName, { color: c.text }]}>
                    {region.name}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
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
    maxHeight: "70%",
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
    paddingBottom: 24,
  },
  regionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  regionName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});
