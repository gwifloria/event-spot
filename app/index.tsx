import { YStack, Text, H1 } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <H1 color="$color">Event Spot</H1>
        <Text color="$colorSubtle" marginTop="$2">
          Discover amazing events near you
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
