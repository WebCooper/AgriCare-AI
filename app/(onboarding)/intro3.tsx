import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Intro3() {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">We respect your privacy and data</Text>
        <Button title="Get Started" onPress={() => router.push('/(auth)/register')} />
      </View>
    );
  }