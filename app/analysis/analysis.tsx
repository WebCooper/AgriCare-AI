import Recommendations from '@/components/analysis/Recommendations';
import ResultActions from '@/components/analysis/ResultActions';
import ResultSummary from '@/components/analysis/ResultSummary';
import { Alert, ScrollView } from 'react-native';

export default function AnalysisResultScreen() {
    const disease = 'Tomato Leaf Curl';
    const confidence = 92;
    const pest = 'Whitefly';
  
    const treatment = 'Apply imidacloprid-based spray. Remove infected leaves.';
    const naturalRemedy = 'Use neem oil every 3 days. Introduce ladybugs.';
    const prevention = 'Avoid over-watering. Regularly inspect the underside of leaves.';
  
    const handleSaveToHistory = () => {
      Alert.alert('Saved!', 'This scan has been saved to your history.');
      // TODO: Save to local storage or backend
    };
  
    return (
      <ScrollView className="flex-1 p-4 bg-gray-50">
        <ResultSummary disease={disease} confidence={confidence} pest={pest} />
        <Recommendations
          treatment={treatment}
          naturalRemedy={naturalRemedy}
          prevention={prevention}
        />
        <ResultActions onSave={handleSaveToHistory} />
      </ScrollView>
    );
  }