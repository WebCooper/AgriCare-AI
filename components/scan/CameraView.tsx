import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CameraViewComponent({ onCapture }: { onCapture: (uri: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        onCapture(photo.uri);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View><Text>Loading camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="h-64 rounded-xl overflow-hidden mb-4">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing='back'
      />

      <TouchableOpacity
        className="absolute bottom-4 self-center bg-white p-3 rounded-full"
        onPress={takePicture}
      >
        <Text className="text-black font-bold">📸</Text>
      </TouchableOpacity>
    </View>
  );
}