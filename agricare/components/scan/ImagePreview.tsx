import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function ImagePreview({ uri, onRetake, onSubmit }: { uri: string; onRetake: () => void; onSubmit: () => void }) {
  return (
    <View className="items-center">
      <Image source={{ uri }} className="w-full h-64 rounded-xl mb-4" resizeMode="cover" />
      <View className="flex-row justify-between w-full">
        <TouchableOpacity onPress={onRetake} className="flex-1 bg-red-100 py-2 rounded-xl mr-2">
          <Text className="text-center text-red-600 font-semibold">Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit} className="flex-1 bg-green-100 py-2 rounded-xl ml-2">
          <Text className="text-center text-green-600 font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
