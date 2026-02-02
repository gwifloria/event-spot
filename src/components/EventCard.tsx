import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { Event } from "../types/event";
import { colors, getColors } from "../constants/colors";
import { formatEventDate, formatEventTime, formatPrice } from "../utils/format";

interface EventCardProps {
  event: Event;
}

// 无意义的 segment 类型，不显示标签
const GENERIC_SEGMENTS = ["Miscellaneous", "Undefined", "Other"];

function isGenericSegment(segment: string): boolean {
  return GENERIC_SEGMENTS.some(
    (g) => segment.toLowerCase() === g.toLowerCase()
  );
}

export function EventCard({ event }: EventCardProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  return (
    <Link href={`/event/${event.id}` as Href} asChild>
      <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: event.imageUrl }}
              style={[styles.image, { backgroundColor: c.placeholder }]}
              resizeMode="cover"
            />
            {event.segment && !isGenericSegment(event.segment) && (
              <View style={styles.segmentBadge}>
                <Text style={styles.segmentText}>{event.segment}</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
              {event.name}
            </Text>

            <Text style={styles.date}>
              {formatEventDate(event.date)}
              {event.time && ` · ${formatEventTime(event.time)}`}
            </Text>

            {event.venue && (
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={12} color={c.textSecondary} />
                <Text
                  style={[styles.infoText, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {event.venue.city || event.venue.name}
                </Text>
              </View>
            )}

            {event.priceRange && (
              <Text style={[styles.price, { color: c.text }]}>
                from{" "}
                {formatPrice(event.priceRange.min, event.priceRange.currency)}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  segmentBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    height: 40, // 固定 2 行高度，保持卡片对齐
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
