import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Intro1() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl">Welcome to AgriCare AI!</Text>
      <Button title="Next" onPress={() => router.push('/(onboarding)/intro2')} />
    </View>
  );
}
