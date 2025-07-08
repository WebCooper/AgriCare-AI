import CameraView from '@/components/scan/CameraView';
import GalleryUpload from '@/components/scan/GalleryUpload';
import ImagePreview from '@/components/scan/ImagePreview';
import PredictionHistoryList from '@/components/scan/PredictionHistoryList';
import PredictionResult from '@/components/scan/PredictionResult';
import { 
  predictDisease, 
  PredictionResponse, 
  savePredictionToHistory, 
  getPredictionHistory,
  PredictionHistory
} from '@/services/predictionService';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, Alert, View, Text, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CameraViewRef } from '@/components/scan/CameraView';


export default function ScanScreen() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [imageUri, setImageUri] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraViewRef>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [remountCamera, setRemountCamera] = useState(0);

  // Load prediction history when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadPredictionHistory();
      
      // Set focus state to true when tab is focused
      setIsFocused(true);
      // Remount the camera when the tab gains focus
      setRemountCamera(prev => prev + 1);
      
      return () => {
        // Set focus state to false when tab loses focus
        setIsFocused(false);
      };
    }, [])
  );

  // Load prediction history
  const loadPredictionHistory = async () => {
    try {
      const history = await getPredictionHistory();
      setPredictionHistory(history);
    } catch (err) {
      console.error('Error loading prediction history:', err);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPredictionHistory();
    setRefreshing(false);
  };

  const handleCapture = (uri: string) => {
    setImageUri(uri);
    // Reset prediction when a new image is captured
    setPrediction(null);
    setError(null);
    setSelectedPrediction(null);
  };

  const handleUpload = (uri: string) => {
    setImageUri(uri);
    // Reset prediction when a new image is uploaded
    setPrediction(null);
    setError(null);
    setSelectedPrediction(null);
  };

  const handleRetake = () => {
    setImageUri('');
    setPrediction(null);
    setError(null);
    setSelectedPrediction(null);
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select or capture an image first');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      setPrediction(null);
      
      // Call the prediction service
      const result = await predictDisease(imageUri);
      
      // Update state with the prediction result
      setPrediction(result);
      
      if (!result.success) {
        setError('The analysis could not be completed. Please try again with a clearer image.');
      } else {
        // Save prediction to history if successful
        const savedPrediction = await savePredictionToHistory(
          result, 
          imageUri, 
          selectedCrop
        );
        
        // Refresh the history list
        await loadPredictionHistory();
      }
    } catch (err) {
      setError('An error occurred during analysis. Please check your internet connection and try again.');
      console.error('Error submitting image for analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHistoryItemPress = (item: PredictionHistory) => {
    // Load selected prediction into the current view
    setSelectedPrediction(item);
    setImageUri(item.imageUri);
    setPrediction(item);
    setSelectedCrop(item.cropType);
    setError(null);
  };

  const handleClearSelectedPrediction = () => {
    setSelectedPrediction(null);
    setImageUri('');
    setPrediction(null);
    setError(null);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-3">
        {imageUri ? (
          <>
            <View>
              <TouchableOpacity
                onPress={selectedPrediction ? handleClearSelectedPrediction : handleRetake}
                className="flex-row items-center mb-2 bg-gray-200 self-start px-3 py-1 rounded-full"
              >
                <Ionicons name="chevron-back" size={16} color="#4b5563" />
                <Text className="text-gray-600 ml-1">
                  {selectedPrediction ? 'Back to camera' : 'Retake'}
                </Text>
              </TouchableOpacity>
              <ImagePreview uri={imageUri} onRetake={handleRetake} onSubmit={handleSubmit} />
              
              {/* Show prediction results */}
              <PredictionResult 
                prediction={prediction} 
                isLoading={isAnalyzing}
                error={error}
              />
            </View>
          </>
        ) : (
          <>
            {/* Camera Container */}
            <View className="overflow-hidden rounded-xl bg-black aspect-[3/4] mx-auto w-[90%] shadow-lg mb-2">
              {isFocused && (
                <CameraView 
                  key={`camera-${remountCamera}`} 
                  ref={cameraRef} 
                  onCapture={handleCapture} 
                />
              )}
            </View>
            
            {/* Camera Controls */}
            <View className="flex-row justify-center items-center mb-6 mt-2 w-full">
              {/* Centered container for buttons */}
              <View className="flex-row justify-center items-center w-full">
                {/* Gallery upload button (left) */}
                <View className="w-12 mr-6">
                  <GalleryUpload onUpload={handleUpload} />
                </View>
                
                {/* Shutter Button (center) */}
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      setIsCapturing(true);
                      await cameraRef.current?.takePicture();
                    } catch (error) {
                      console.error('Error taking picture:', error);
                    } finally {
                      setIsCapturing(false);
                    }
                  }}
                  disabled={isCapturing || !isFocused}
                  className="h-16 w-16 rounded-full items-center justify-center shadow-lg bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,
                    elevation: 6,
                  }}
                >
                  {isCapturing ? (
                    <ActivityIndicator size="small" color="#10b981" />
                  ) : (
                    <View className="h-12 w-12 border-4 rounded-full border-green-500" />
                  )}
                </TouchableOpacity>
                
                {/* Empty view for balance (right) */}
                <View className="w-12 ml-6" />
              </View>
            </View>
            
            {/* Prediction history section */}
            <View className="pt-4 border-t border-gray-200">
              <PredictionHistoryList 
                historyItems={predictionHistory} 
                onItemPress={handleHistoryItemPress}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
