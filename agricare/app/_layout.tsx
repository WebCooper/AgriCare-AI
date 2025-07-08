import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import './global.css';
import { useEffect, useState } from "react";
import authService from "@/services/authService";
import { ActivityIndicator, View } from "react-native";

// Authentication context to manage user state across the app
function AuthCheck({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        // Get the current segment/route
        const inAuthGroup = segments[0] === "(auth)";
        const inOnboardingGroup = segments[0] === "(onboarding)";
        const inTabsGroup = segments[0] === "(tabs)";
        const isOnSplash = segments[0] === "splash";
        
        if (authenticated) {
          // If user is authenticated but is in auth or onboarding, redirect to home
          if (inAuthGroup || inOnboardingGroup || isOnSplash) {
            router.replace("/(tabs)");
          }
        } else {
          // If user is not authenticated and not in auth group or onboarding, redirect
          if (!inAuthGroup && !isOnSplash && !inOnboardingGroup) {
            router.replace("/(auth)/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }
  
  return <>{children}</>;
}

export default function RootLayout() {
  return(
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    {/* <StatusBar hidden={true}/> */}
    <AuthCheck>
      <Stack>
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
          }}
        />

    
    <Stack.Screen
      name="(tabs)"
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="(auth)"
      options={{
        headerShown: false,
      }}
      />

    <Stack.Screen
      name="(onboarding)"
      options={{
        headerShown: false,
      }}
      />

    <Stack.Screen
      name="analysis"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="weather"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="offline"
      options={{
        headerShown: false,
      }}
    />
 
      </Stack>
    </AuthCheck>
  </SafeAreaView>
  );
}
