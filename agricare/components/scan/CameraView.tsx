import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface CameraViewProps {
  onCapture: (uri: string) => void;
}

export interface CameraViewRef {
  takePicture: () => Promise<void>;
}

const CameraViewComponent = forwardRef<CameraViewRef, CameraViewProps>(function CameraViewComponent(props, ref) {
  const { onCapture } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<ExpoCameraView>(null);

  // Expose takePicture method to parent component
  useImperativeHandle(ref, () => ({
    takePicture: async () => {
      await takePicture();
    }
  }));

  // Request camera permission on component mount if not already granted
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Handler for when the camera is ready
  const handleCameraReady = () => {
    console.log('Camera is ready');
    setCameraReady(true);
  };

  // Take a picture using the camera
  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) {
      console.log('Camera not ready, ref not available, or already capturing');
      return;
    }

    try {
      setIsCapturing(true);
      console.log('Taking picture with CameraView...');
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo && photo.uri) {
        console.log('Picture taken:', photo.uri);
        onCapture(photo.uri);
      } else {
        throw new Error('Failed to capture image');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Loading state
  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-white mt-4">Loading camera...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 px-6">
        <Ionicons name="camera-outline" size={60} color="white" />
        <Text className="text-white text-lg font-bold mt-4 mb-2">Camera Access Required</Text>
        <Text className="text-white text-center mb-6">
          We need camera access to help you analyze plant diseases
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-500 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-bold text-center">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera view
  return (
    <View className="flex-1 relative">
      <ExpoCameraView
        ref={cameraRef}
        className="flex-1"
        facing="back"
        onCameraReady={handleCameraReady}
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          Alert.alert('Camera Error', 'Failed to initialize camera. Please restart the app.');
        }}
        style={{ flex: 1 }}
      />
      
      {/* Loading indicator while camera initializes */}
      {!isCameraReady && (
        <View className="absolute inset-0 flex-1 items-center justify-center bg-black/60">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-white mt-2">Initializing camera...</Text>
        </View>
      )}
    </View>
  );
});

export default CameraViewComponent;