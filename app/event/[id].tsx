import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Linking,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEventDetail } from "../../src/hooks";
import { ErrorView } from "../../src/components";
import { colors, getColors } from "../../src/constants/colors";
import {
  formatEventDate,
  formatEventTime,
  formatPriceRange,
} from "../../src/utils/formatDate";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function EventDetailScreen() {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");

  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch,
  } = useEventDetail(id || "");

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  const handleBuyTickets = () => {
    if (event?.url) {
      Linking.openURL(event.url);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: c.background }]}
        edges={["top"]}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !event) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: c.background }]}
        edges={["top"]}
      >
        <BackButton colors={c} />
        <ErrorView
          message={error?.message || "Event not found"}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  // Get images for carousel (prefer 16:9 or 3:2 ratio)
  const carouselImages = event.images
    .filter((img) => img.ratio === "16_9" || img.ratio === "3_2")
    .slice(0, 5);

  if (carouselImages.length === 0 && event.imageUrl) {
    carouselImages.push({ url: event.imageUrl, width: 640, height: 360 });
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: c.background }]}
      edges={["top"]}
    >
      <BackButton colors={c} floating />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {carouselImages.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.url }}
                style={[
                  styles.carouselImage,
                  { backgroundColor: c.placeholder },
                ]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {carouselImages.length > 1 && (
            <View style={styles.indicators}>
              {carouselImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        index === activeImageIndex
                          ? c.indicatorActive
                          : c.indicatorInactive,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {event.genre && (
            <Text style={styles.genre}>
              {event.segment} · {event.genre}
            </Text>
          )}

          <Text style={[styles.title, { color: c.text }]}>{event.name}</Text>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: c.backgroundSecondary },
              ]}
            >
              <Text style={styles.icon}>📅</Text>
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: c.text }]}>
                {formatEventDate(event.date)}
              </Text>
              {event.time && (
                <Text style={[styles.infoSubtitle, { color: c.textSecondary }]}>
                  {formatEventTime(event.time)}
                </Text>
              )}
            </View>
          </View>

          {/* Venue */}
          {event.venue && (
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: c.backgroundSecondary },
                ]}
              >
                <Text style={styles.icon}>📍</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: c.text }]}>
                  {event.venue.name}
                </Text>
                {(event.venue.city || event.venue.address) && (
                  <Text
                    style={[styles.infoSubtitle, { color: c.textSecondary }]}
                    numberOfLines={1}
                  >
                    {event.venue.address && `${event.venue.address}, `}
                    {event.venue.city}
                    {event.venue.state && `, ${event.venue.state}`}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Price Range */}
          {event.priceRange && (
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: c.backgroundSecondary },
                ]}
              >
                <Text style={styles.icon}>🎫</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: c.text }]}>
                  {formatPriceRange(
                    event.priceRange.min,
                    event.priceRange.max,
                    event.priceRange.currency
                  )}
                </Text>
                <Text style={[styles.infoSubtitle, { color: c.textSecondary }]}>
                  Price range
                </Text>
              </View>
            </View>
          )}

          {/* Description */}
          {event.info && (
            <View style={styles.aboutSection}>
              <Text style={[styles.aboutTitle, { color: c.text }]}>About</Text>
              <Text style={[styles.aboutText, { color: c.textSecondary }]}>
                {event.info}
              </Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Buy Tickets Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: c.background, borderTopColor: c.border },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.buyButton,
            pressed && styles.buyButtonPressed,
          ]}
          onPress={handleBuyTickets}
        >
          <Text style={styles.buyButtonText}>Get Tickets</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type ThemeColors = ReturnType<typeof getColors>;

function BackButton({
  colors: c,
  floating = false,
}: {
  colors: ThemeColors;
  floating?: boolean;
}) {
  return (
    <View
      style={floating ? styles.backButtonFloating : styles.backButtonStatic}
    >
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { backgroundColor: c.backButton },
          pressed && styles.pressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={[styles.backIcon, { color: c.text }]}>←</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.6,
  },
  indicators: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  genre: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoSubtitle: {
    fontSize: 14,
  },
  aboutSection: {
    marginTop: 8,
    gap: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buyButtonPressed: {
    opacity: 0.8,
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButtonFloating: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
  },
  backButtonStatic: {
    padding: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
