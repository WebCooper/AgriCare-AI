import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PredictionResponse } from '@/services/predictionService';

interface PredictionResultProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function PredictionResult({ 
  prediction, 
  isLoading, 
  error 
}: PredictionResultProps) {
  
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-md mt-4">
        <Text className="text-center text-gray-600">Analyzing image...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-md mt-4 border-l-4 border-red-500">
        <Text className="text-lg font-bold text-red-600">Analysis Failed</Text>
        <Text className="text-gray-700 mt-1">{error}</Text>
      </View>
    );
  }
  
  if (!prediction) {
    return null;
  }

  // Format the confidence percentage
  const confidencePercent = Math.round(prediction.confidence * 100);
  
  // Determine severity level based on confidence
  let severityColor = 'bg-green-100';
  let severityTextColor = 'text-green-700';
  
  if (confidencePercent > 70) {
    severityColor = 'bg-red-100';
    severityTextColor = 'text-red-700';
  } else if (confidencePercent > 40) {
    severityColor = 'bg-yellow-100';
    severityTextColor = 'text-yellow-700';
  }

  // Format disease name for better readability (convert Tomato_Late_blight to Tomato Late Blight)
  const formattedDiseaseName = prediction.predicted_class
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <View className="bg-white p-4 rounded-lg shadow-md mt-4">
      <Text className="text-lg font-bold text-gray-800">Analysis Results</Text>
      
      <View className="mt-3">
        <Text className="text-base font-semibold text-gray-700">Detected Condition:</Text>
        <Text className={`text-lg font-bold ${severityTextColor} mt-1`}>
          {formattedDiseaseName}
        </Text>
      </View>
      
      <View className="mt-3">
        <Text className="text-base font-semibold text-gray-700">Confidence Level:</Text>
        <View className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <View 
            className={`${severityColor} h-2.5 rounded-full`} 
            style={{ width: `${confidencePercent}%` }} 
          />
        </View>
        <Text className="text-right text-sm text-gray-600 mt-1">
          {confidencePercent}%
        </Text>
      </View>
      
      <View className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-gray-600">
          {confidencePercent > 70 
            ? 'High confidence in this diagnosis. Immediate action recommended.' 
            : confidencePercent > 40 
              ? 'Moderate confidence in this diagnosis. Monitor closely.' 
              : 'Low confidence in this diagnosis. Consider retaking the image.'}
        </Text>
      </View>
    </View>
  );
}
