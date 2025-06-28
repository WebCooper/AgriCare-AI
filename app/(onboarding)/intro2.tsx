import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Intro2() {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Learn to scan crops efficiently</Text>
        <Button title="Next" onPress={() => router.push('/(onboarding)/intro3')} />
      </View>
    );
  }