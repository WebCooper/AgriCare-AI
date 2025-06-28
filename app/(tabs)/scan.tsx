import CameraView from '@/components/scan/CameraView';
import CropSelector from '@/components/scan/CropSelector';
import GalleryUpload from '@/components/scan/GalleryUpload';
import ImagePreview from '@/components/scan/ImagePreview';
import { useState } from 'react';
import { ScrollView } from 'react-native';


export default function ScanScreen() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [imageUri, setImageUri] = useState('');

  const handleCapture = (uri: string) => {
    setImageUri(uri);
  };

  const handleUpload = (uri: string) => {
    setImageUri(uri);
  };

  const handleRetake = () => {
    setImageUri('');
  };

  const handleSubmit = () => {
    console.log('Submit image for analysis:', imageUri);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <CropSelector selected={selectedCrop} onChange={setSelectedCrop} />
      {imageUri ? (
        <ImagePreview uri={imageUri} onRetake={handleRetake} onSubmit={handleSubmit} />
      ) : (
        <>
          <CameraView onCapture={handleCapture} />
          <GalleryUpload onUpload={handleUpload} />
        </>
      )}
    </ScrollView>
  );
}
