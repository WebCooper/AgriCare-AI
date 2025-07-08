import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GalleryUploadProps {
  onUpload: (uri: string) => void;
}

export default function GalleryUpload({ onUpload }: GalleryUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      // Request permission first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to upload images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      onPress={pickImage}
      disabled={isLoading}
      className="items-center justify-center"
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: isLoading ? '#e5e7eb' : '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#10b981" />
      ) : (
        <Ionicons name="images" size={22} color="#10b981" />
      )}
    </TouchableOpacity>
  );
}