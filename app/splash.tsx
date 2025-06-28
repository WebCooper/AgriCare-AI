import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      // Example: If first time user
      router.replace('/(onboarding)/intro1');
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">AgriCare AI</Text>
    </View>
  );
}
