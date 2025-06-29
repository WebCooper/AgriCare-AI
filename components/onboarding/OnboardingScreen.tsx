import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  description: string;
  image: any;
  nextScreen?: string;
  isLast?: boolean;
}

export default function OnboardingScreen({ title, description, image, nextScreen, isLast }: Props) {
  const router = useRouter();

  const handleNext = () => {
    if (isLast) {
      router.replace('/(auth)/login');
    } else if (nextScreen) {
      router.push(nextScreen as any);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Image source={image} className="w-64 h-64 mb-8" resizeMode="contain" />
      <Text className="text-2xl font-bold text-center mb-4">{title}</Text>
      <Text className="text-gray-600 text-center mb-10">{description}</Text>

      <TouchableOpacity onPress={handleNext} className="bg-green-600 px-6 py-3 rounded-xl">
        <Text className="text-white font-semibold">{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')} className="mt-4">
        <Text className="text-gray-500 underline">Skip</Text>
      </TouchableOpacity>
    </View>
  );
}
