import * as ImagePicker from 'expo-image-picker';
import { Text, TouchableOpacity } from 'react-native';

export default function GalleryUpload({ onUpload }: { onUpload: (uri: string) => void }) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      onUpload(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity className="bg-green-200 py-2 px-4 rounded-xl mb-4" onPress={pickImage}>
      <Text className="text-center font-semibold">Upload from Gallery</Text>
    </TouchableOpacity>
  );
}