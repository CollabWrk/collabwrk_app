
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css"; // NativeWind styles

import { AppProvider, useApp } from '@/context/AppContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSegments, useRouter } from 'expo-router';

function RootLayoutNav() {
  const { colorScheme, user, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const onLogin = segments[0] === 'login';

    if (!user && !onLogin) {
      // Redirect to the login page if not authenticated
      router.replace('/login');
    } else if (user && onLogin) {
      // Redirect to the tabs page if authenticated
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="manual/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { Auth0Provider } from 'react-native-auth0';

// ...

export default function RootLayout() {
  return (
    <Auth0Provider
      domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'PLACEHOLDER_DOMAIN'}
      clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID'}
    >
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </Auth0Provider>
  );
}
