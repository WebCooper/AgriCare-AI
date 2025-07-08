import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PredictionHistory } from '@/services/predictionService';
import { Ionicons } from '@expo/vector-icons';

interface PredictionHistoryListProps {
  historyItems: PredictionHistory[];
  onItemPress?: (item: PredictionHistory) => void;
}

export default function PredictionHistoryList({ 
  historyItems,
  onItemPress
}: PredictionHistoryListProps) {
  
  if (historyItems.length === 0) {
    return (
      <View className="bg-white p-6 rounded-xl shadow-sm mt-4 items-center justify-center">
        <View className="bg-green-50 p-4 rounded-full mb-2">
          <Ionicons name="leaf-outline" size={40} color="#4ade80" />
        </View>
        <Text className="text-gray-800 font-bold text-lg text-center mt-2">No prediction history yet</Text>
        <Text className="text-gray-500 text-center text-sm mt-1 px-4 leading-5">
          Capture and analyze plants to see your diagnosis history here
        </Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: PredictionHistory }) => {
    // Format disease name for better readability
    const formattedDiseaseName = item.predicted_class
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Format confidence
    const confidencePercent = Math.round(item.confidence * 100);
    
    // Determine severity color
    let severityColor = '#16a34a'; // Green
    if (confidencePercent > 70) {
      severityColor = '#dc2626'; // Red
    } else if (confidencePercent > 40) {
      severityColor = '#ca8a04'; // Yellow/amber
    }
    
    // Determine severity text based on confidence
    let accuracyLabel = 'Low Accuracy';
    if (confidencePercent > 70) {
      accuracyLabel = 'High Accuracy';
    } else if (confidencePercent > 40) {
      accuracyLabel = 'Moderate Accuracy';
    }

    return (
      <TouchableOpacity 
        className="bg-white p-4 mb-4 rounded-xl shadow-sm flex-row items-center overflow-hidden"
        style={{ 
          borderLeftWidth: 4, 
          borderLeftColor: severityColor,
          elevation: 2
        }}
        onPress={() => onItemPress?.(item)}
      >
        <Image 
          source={{ uri: item.imageUri }} 
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
          style={{ borderWidth: 2, borderColor: '#f3f4f6' }}
        />
        
        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xs text-gray-500">{formatDate(item.timestamp)}</Text>
            <Text className="text-xs font-medium capitalize bg-gray-100 px-2 py-0.5 rounded-full">
              {item.cropType}
            </Text>
          </View>
          
          <Text className="font-bold text-base" style={{ color: severityColor }}>
            {formattedDiseaseName}
          </Text>
          
          <View className="flex-row items-center mt-2">
            <View className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
              <View 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${confidencePercent}%`, 
                  backgroundColor: severityColor,
                }}
              />
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs font-semibold text-gray-700 mr-1">
                {confidencePercent}%
              </Text>
              <Text className="text-xs italic" style={{ color: severityColor }}>
                ({accuracyLabel})
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-1 h-5 bg-green-500 rounded mr-2" />
          <Text className="text-lg font-bold text-gray-800">Recent Predictions</Text>
        </View>
        <View className="bg-gray-100 px-2 py-1 rounded-full">
          <Text className="text-xs font-medium text-gray-600">{historyItems.length} Result{historyItems.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      
      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Parent ScrollView will handle scrolling
        initialNumToRender={5}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}
