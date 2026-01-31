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
import { LinearGradient } from "expo-linear-gradient";
import type { Href } from "expo-router";
import type { Event } from "../types/event";
import { colors, getColors } from "../constants/colors";
import {
  formatEventDate,
  formatEventTime,
  formatPrice,
} from "../utils/formatDate";

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
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const day = eventDate.getDate();

  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={[styles.gridImage, { backgroundColor: c.placeholder }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          style={styles.gradient}
        />

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
        </View>
      </View>

      <View style={styles.gridContent}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {event.name}
        </Text>

        {event.venue && (
          <View style={styles.venueRow}>
            <Feather name="map-pin" size={13} color={c.textSecondary} />
            <Text
              style={[styles.venueText, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {event.venue.city || event.venue.name}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.tagsContainer}>
            {event.genre && (
              <Text style={[styles.genreTag, { color: c.textTertiary }]}>
                {event.genre}
              </Text>
            )}
          </View>
          {event.priceRange && (
            <Text style={styles.price}>
              from{" "}
              {formatPrice(event.priceRange.min, event.priceRange.currency)}
            </Text>
          )}
        </View>
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
      <View style={styles.listImageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={[styles.listImage, { backgroundColor: c.placeholder }]}
          resizeMode="cover"
        />
      </View>
      <View style={styles.listInfo}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={[styles.date, { color: colors.primary }]}>
          {formatEventDate(event.date)}
          {event.time && ` · ${formatEventTime(event.time)}`}
        </Text>
        <View style={styles.listFooter}>
          {event.venue && (
            <View style={styles.venueRow}>
              <Feather name="map-pin" size={12} color={c.textTertiary} />
              <Text
                style={[styles.listVenueText, { color: c.textTertiary }]}
                numberOfLines={1}
              >
                {event.venue.name}
              </Text>
            </View>
          )}
          {event.priceRange && (
            <View style={styles.listPriceTag}>
              <Text style={styles.listPrice}>
                {formatPrice(event.priceRange.min, event.priceRange.currency)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: "relative",
  },
  gridImage: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 20,
  },
  gridContent: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  venueText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  genreTag: {
    fontSize: 12,
    fontWeight: "500",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  listContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    overflow: "hidden",
  },
  listImageContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  listImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  listInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
    overflow: "hidden",
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  listVenueText: {
    fontSize: 12,
    flex: 1,
  },
  listPriceTag: {
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  listPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
});
