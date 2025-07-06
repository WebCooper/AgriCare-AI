import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import './global.css';

export default function RootLayout() {
  return(
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <StatusBar hidden={true}/> */}
    <Stack >
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
  
  </SafeAreaView>
  )

    ;
}
