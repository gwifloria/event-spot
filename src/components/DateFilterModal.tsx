import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";
import { colors, getColors } from "../constants/colors";
import {
  DATE_FILTERS,
  type DateFilter,
  type DateFilterPreset,
  type CustomDateRange,
  isCustomDateFilter,
  getPresetDateStrings,
} from "../utils/dateFilter";

interface DateFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFilter: DateFilter;
  onSelectFilter: (filter: DateFilter) => void;
}

type MarkedDates = {
  [date: string]: {
    selected?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
};

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DateFilterModal({
  visible,
  onClose,
  selectedFilter,
  onSelectFilter,
}: DateFilterModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const c = getColors(isDark ? "dark" : "light");
  const insets = useSafeAreaInsets();

  // 计算初始状态
  const getInitialState = () => {
    if (isCustomDateFilter(selectedFilter)) {
      return {
        preset: null as DateFilterPreset | null,
        start: selectedFilter.startDate,
        end: selectedFilter.endDate,
      };
    }
    if (selectedFilter === "all") {
      return { preset: selectedFilter, start: null, end: null };
    }
    const range = getPresetDateStrings(selectedFilter);
    return {
      preset: selectedFilter,
      start: range?.start ?? null,
      end: range?.end ?? null,
    };
  };

  // 当前选中的预设（用户在日历上修改日期后清空）
  const [activePreset, setActivePreset] = useState<DateFilterPreset | null>(
    () => getInitialState().preset
  );
  // 日历上显示的日期范围
  const [customStart, setCustomStart] = useState<string | null>(
    () => getInitialState().start
  );
  const [customEnd, setCustomEnd] = useState<string | null>(
    () => getInitialState().end
  );

  // Modal 打开时重置状态
  useEffect(() => {
    if (visible) {
      const initial = getInitialState();
      setActivePreset(initial.preset);
      setCustomStart(initial.start);
      setCustomEnd(initial.end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handlePresetSelect = (preset: DateFilterPreset) => {
    setActivePreset(preset);
    if (preset === "all") {
      setCustomStart(null);
      setCustomEnd(null);
    } else {
      const range = getPresetDateStrings(preset);
      if (range) {
        setCustomStart(range.start);
        setCustomEnd(range.end);
      }
    }
  };

  const handleDayPress = (day: DateData) => {
    // 用户点击日历，清空预设选择
    setActivePreset(null);

    if (!customStart || (customStart && customEnd)) {
      // 开始新的选择
      setCustomStart(day.dateString);
      setCustomEnd(null);
    } else {
      // 选择结束日期
      if (day.dateString < customStart) {
        setCustomEnd(customStart);
        setCustomStart(day.dateString);
      } else {
        setCustomEnd(day.dateString);
      }
    }
  };

  const handleApply = () => {
    if (activePreset !== null) {
      // 预设选中且未修改
      onSelectFilter(activePreset);
    } else if (customStart && customEnd) {
      // 自定义日期范围
      const customRange: CustomDateRange = {
        type: "custom",
        startDate: customStart,
        endDate: customEnd,
      };
      onSelectFilter(customRange);
    }
    onClose();
  };

  const handleClear = () => {
    setActivePreset("all");
    setCustomStart(null);
    setCustomEnd(null);
    onSelectFilter("all");
    onClose();
  };

  const markedDates = useMemo<MarkedDates>(() => {
    if (!customStart) return {};

    const marked: MarkedDates = {};

    if (customStart && !customEnd) {
      marked[customStart] = {
        selected: true,
        startingDay: true,
        endingDay: true,
        color: colors.primary,
        textColor: colors.white,
      };
    } else if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      const current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        const isStart = dateStr === customStart;
        const isEnd = dateStr === customEnd;

        marked[dateStr] = {
          selected: true,
          startingDay: isStart,
          endingDay: isEnd,
          color: colors.primary,
          textColor: colors.white,
        };

        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  }, [customStart, customEnd]);

  const today = new Date().toISOString().split("T")[0];

  const calendarTheme = {
    backgroundColor: c.background,
    calendarBackground: c.background,
    textSectionTitleColor: c.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.white,
    todayTextColor: colors.primary,
    dayTextColor: c.text,
    textDisabledColor: c.textTertiary,
    monthTextColor: c.text,
    arrowColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "600" as const,
    textDayHeaderFontWeight: "500" as const,
  };

  // Apply 按钮是否可用
  const canApply = activePreset !== null || (customStart && customEnd);

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
          <View style={[styles.header, { borderBottomColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>Select Date</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={c.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {DATE_FILTERS.map((filter) => {
              const isSelected = activePreset === filter.id;
              return (
                <Pressable
                  key={filter.id}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: isSelected
                        ? c.backgroundSecondary
                        : "transparent",
                    },
                  ]}
                  onPress={() => handlePresetSelect(filter.id)}
                >
                  <View style={styles.radio}>
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                  <Text style={[styles.optionLabel, { color: c.text }]}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}

            <View style={[styles.divider, { backgroundColor: c.border }]} />

            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={markedDates}
                markingType="period"
                minDate={today}
                theme={calendarTheme}
                style={[styles.calendar, { borderColor: c.border }]}
              />
              {customStart && (
                <Text style={[styles.rangeText, { color: c.textSecondary }]}>
                  Selected: {formatDisplayDate(customStart)}
                  {customEnd
                    ? ` → ${formatDisplayDate(customEnd)}`
                    : " → Select end date"}
                </Text>
              )}
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                borderTopColor: c.border,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <Pressable
              style={[styles.footerButton, styles.clearButton]}
              onPress={handleClear}
            >
              <Text
                style={[styles.clearButtonText, { color: c.textSecondary }]}
              >
                Clear
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.footerButton,
                styles.applyButton,
                { backgroundColor: colors.primary },
                !canApply && styles.buttonDisabled,
              ]}
              onPress={handleApply}
              disabled={!canApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
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
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  calendar: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  rangeText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 16,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    backgroundColor: "transparent",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {},
  applyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
