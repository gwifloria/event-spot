import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import config from "../tamagui.config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
