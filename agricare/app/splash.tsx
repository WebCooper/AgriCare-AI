// app/splash.tsx
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';

const statusMessages = [
  '🌱 Getting your app ready...',
  '🔍 Checking environment...',
  '🚀 Almost done...',
  '📦 Loading resources...',
  '🌿 Preparing fields...'
];

export default function SplashScreen() {
  const [status, setStatus] = useState(statusMessages[0]);
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Status text animation
    const interval = setInterval(() => {
      setStatus((prev) => {
        const nextIndex = (statusMessages.indexOf(prev) + 1) % statusMessages.length;
        return statusMessages[nextIndex];
      });
    }, 1200);

    // Loader animation
    Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Navigate after splash delay - Auth logic is now handled by AuthCheck in _layout.tsx
    const timeout = setTimeout(() => {
      // The routing will be handled by the AuthCheck component
      // This navigation will be intercepted if the user is already authenticated
      router.replace('/(onboarding)/intro1');
    }, 3500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Image
        source={require('../assets/images/icon.png')}
        className="w-64 h-64 mb-8"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-center mb-2">🌿 AgriCare AI</Text>

      <View className="h-12 justify-end items-center mt-8">
        <Text className="text-gray-600 text-base text-center mb-2">{status}</Text>

        {/* Animated 3-dot loader */}
        <View className="flex-row space-x-1">
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#4ade80',
                opacity: dotAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: i === 0 ? [1, 0.3, 1] : i === 1 ? [0.3, 1, 0.3] : [0.3, 0.3, 1]
                })
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
