import axios from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PredictionResponse {
  predicted_class: string;
  confidence: number;
  success: boolean;
}

export interface PredictionHistory extends PredictionResponse {
  id: string;
  imageUri: string;
  cropType: string;
  timestamp: number;
}

const PREDICTION_HISTORY_KEY = 'agricare_prediction_history';

/**
 * Upload an image for disease prediction
 * @param imageUri Local URI of the image to upload
 * @returns Prediction response with disease class and confidence
 */
export const predictDisease = async (imageUri: string): Promise<PredictionResponse> => {
  try {
    // Create a FormData object to send the binary image file
    const formData = new FormData();
    
    // Append the image file to the form data
    formData.append('file', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    // Send the request to the predict endpoint
    const response = await axios.post('/ml/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

/**
 * Save a prediction to the history in local storage
 * @param prediction The prediction response
 * @param imageUri The URI of the analyzed image
 * @param cropType The type of crop that was analyzed
 * @returns The saved prediction history item
 */
export const savePredictionToHistory = async (
  prediction: PredictionResponse, 
  imageUri: string,
  cropType: string
): Promise<PredictionHistory> => {
  try {
    // Get existing predictions from storage
    const existingHistory = await getPredictionHistory();
    
    // Create a new history item
    const historyItem: PredictionHistory = {
      ...prediction,
      id: Date.now().toString(),
      imageUri,
      cropType,
      timestamp: Date.now()
    };
    
    // Add new prediction to the beginning of the array (newest first)
    const updatedHistory = [historyItem, ...existingHistory];
    
    // Limit history to 20 items to avoid storage issues
    const limitedHistory = updatedHistory.slice(0, 20);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(PREDICTION_HISTORY_KEY, JSON.stringify(limitedHistory));
    
    return historyItem;
  } catch (error) {
    console.error('Error saving prediction to history:', error);
    throw error;
  }
};

/**
 * Get all saved prediction history items
 * @returns Array of prediction history items sorted by newest first
 */
export const getPredictionHistory = async (): Promise<PredictionHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(PREDICTION_HISTORY_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Error retrieving prediction history:', error);
    return [];
  }
};

/**
 * Clear all prediction history
 */
export const clearPredictionHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PREDICTION_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing prediction history:', error);
  }
};
