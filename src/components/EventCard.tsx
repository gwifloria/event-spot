import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import type { Href } from "expo-router";
import type { Event } from "../types/event";
import { getColors } from "../constants/colors";
import { formatEventDate, formatEventTime } from "../utils/formatDate";

interface EventCardProps {
  event: Event;
  variant?: "grid" | "list";
}

export function EventCard({ event, variant = "grid" }: EventCardProps) {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const isGrid = variant === "grid";

  return (
    <Link href={`/event/${event.id}` as Href} asChild>
      <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: c.card,
              shadowOpacity: c.shadowOpacity,
            },
          ]}
        >
          {isGrid ? (
            <GridLayout event={event} colors={c} />
          ) : (
            <ListLayout event={event} colors={c} />
          )}
        </View>
      </Pressable>
    </Link>
  );
}

type ThemeColors = ReturnType<typeof getColors>;

function GridLayout({
  event,
  colors: c,
}: {
  event: Event;
  colors: ThemeColors;
}) {
  return (
    <>
      <Image
        source={{ uri: event.imageUrl }}
        style={[styles.gridImage, { backgroundColor: c.placeholder }]}
        resizeMode="cover"
      />
      <View style={styles.gridContent}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={[styles.date, { color: c.textSecondary }]}>
          {formatEventDate(event.date)}
          {event.time && ` · ${formatEventTime(event.time)}`}
        </Text>
        {event.venue && (
          <Text
            style={[styles.venue, { color: c.textTertiary }]}
            numberOfLines={1}
          >
            {event.venue.name}
            {event.venue.city && `, ${event.venue.city}`}
          </Text>
        )}
      </View>
    </>
  );
}

function ListLayout({
  event,
  colors: c,
}: {
  event: Event;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.listContent}>
      <Image
        source={{ uri: event.imageUrl }}
        style={[styles.listImage, { backgroundColor: c.placeholder }]}
        resizeMode="cover"
      />
      <View style={styles.listInfo}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={[styles.date, { color: c.textSecondary }]}>
          {formatEventDate(event.date)}
          {event.time && ` · ${formatEventTime(event.time)}`}
        </Text>
        {event.venue && (
          <Text
            style={[styles.venue, { color: c.textTertiary }]}
            numberOfLines={1}
          >
            {event.venue.name}
            {event.venue.city && `, ${event.venue.city}`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gridImage: {
    width: "100%",
    height: 140,
  },
  gridContent: {
    padding: 12,
    gap: 4,
  },
  listContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    alignItems: "center",
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  listInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
  },
  venue: {
    fontSize: 13,
  },
});
