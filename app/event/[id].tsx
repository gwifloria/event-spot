import { useState, useCallback } from "react";
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
  Share,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEventDetail } from "../../src/hooks";
import { ErrorView, Toast } from "../../src/components";
import { colors, getColors } from "../../src/constants/colors";
import {
  formatEventDate,
  formatEventTime,
  formatPriceRange,
} from "../../src/utils/format";
import { useAppStore } from "../../src/stores/appStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function EventDetailScreen() {
  const colorScheme = useColorScheme();
  const c = getColors(colorScheme === "dark" ? "dark" : "light");
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch,
  } = useEventDetail(id || "");

  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = id ? favorites.includes(id) : false;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  const handleBuyTickets = () => {
    if (event?.url) {
      Linking.openURL(event.url);
    }
  };

  const handleToggleFavorite = () => {
    if (id) {
      const wasInFavorites = favorites.includes(id);
      toggleFavorite(id);
      setToast({
        visible: true,
        message: wasInFavorites
          ? "Removed from favorites"
          : "Added to favorites",
      });
    }
  };

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        title: event.name,
        message: `${event.name}\n${event.url}`,
        url: event.url, // iOS only
      });
    } catch {
      // User cancelled or share failed
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
      <View style={[styles.floatingHeader, { top: insets.top + 16 }]}>
        <BackButton colors={c} floating />
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
            onPress={handleToggleFavorite}
          >
            <View
              style={[
                styles.actionButtonCircle,
                isFavorite && styles.actionButtonFavorited,
              ]}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color="#fff"
              />
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
            onPress={handleShare}
          >
            <View style={styles.actionButtonCircle}>
              <Feather name="share" size={20} color="#fff" />
            </View>
          </Pressable>
        </View>
      </View>

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
          {(event.segment || event.genre) && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {[event.segment, event.genre].filter(Boolean).join(" · ")}
              </Text>
            </View>
          )}

          <Text style={[styles.title, { color: c.text }]}>{event.name}</Text>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {/* Date & Time */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: c.backgroundSecondary },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#eef2ff" }]}>
                <Feather name="calendar" size={20} color="#6366f1" />
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: c.textTertiary }]}>
                  Date & Time
                </Text>
                <Text style={[styles.infoTitle, { color: c.text }]}>
                  {formatEventDate(event.date)}
                </Text>
                {event.time && (
                  <Text
                    style={[styles.infoSubtitle, { color: c.textSecondary }]}
                  >
                    {formatEventTime(event.time)}
                  </Text>
                )}
              </View>
            </View>

            {/* Venue */}
            {event.venue && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: c.backgroundSecondary },
                ]}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: "#fce7f3" }]}
                >
                  <Feather name="map-pin" size={20} color="#ec4899" />
                </View>
                <View style={styles.infoText}>
                  <Text style={[styles.infoLabel, { color: c.textTertiary }]}>
                    Location
                  </Text>
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
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: c.backgroundSecondary },
                ]}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: "#d1fae5" }]}
                >
                  <Feather name="tag" size={20} color="#10b981" />
                </View>
                <View style={styles.infoText}>
                  <Text style={[styles.infoLabel, { color: c.textTertiary }]}>
                    Price Range
                  </Text>
                  <Text style={[styles.infoTitle, { color: c.text }]}>
                    {formatPriceRange(
                      event.priceRange.min,
                      event.priceRange.max,
                      event.priceRange.currency
                    )}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {event.info && (
            <View style={styles.aboutSection}>
              <View style={styles.aboutHeader}>
                <Feather name="info" size={18} color={c.textTertiary} />
                <Text style={[styles.aboutTitle, { color: c.text }]}>
                  Event Details
                </Text>
              </View>
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
          <Feather name="shopping-bag" size={18} color={colors.white} />
          <Text style={styles.buyButtonText}>Get Tickets</Text>
        </Pressable>
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type="success"
        onHide={hideToast}
      />
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
  const isDark = c.background === colors.dark.background;

  if (floating) {
    return (
      <Pressable
        style={({ pressed }) => [pressed && styles.pressed]}
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View
          style={[
            styles.backButtonCircle,
            { backgroundColor: "rgba(0,0,0,0.3)" },
          ]}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.backButtonStatic,
        pressed && styles.pressed,
      ]}
      onPress={() => router.back()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View
        style={[
          styles.backButtonCircle,
          { backgroundColor: c.backgroundSecondary },
        ]}
      >
        <Feather name="arrow-left" size={20} color={isDark ? "#fff" : "#000"} />
      </View>
    </Pressable>
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
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 34,
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    gap: 12,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
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
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buyButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {},
  actionButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonFavorited: {
    backgroundColor: "#ef4444",
  },
  backButtonStatic: {
    padding: 16,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
