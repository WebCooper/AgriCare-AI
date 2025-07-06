import { Share, Text, TouchableOpacity, View } from 'react-native';

interface ReportDetailsProps {
  report: {
    crop: string;
    date: string;
    disease: string;
    confidence: string;
    pest: string;
    treatment: string;
    remedies: string;
    prevention: string;
  };
}

export default function ReportDetails({ report }: ReportDetailsProps) {
  const handleShare = async () => {
    await Share.share({
      message: `Crop: ${report.crop}\nDisease: ${report.disease}\nConfidence: ${report.confidence}\nPest: ${report.pest}`,
    });
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow space-y-3">
      <Text className="text-xl font-bold">{report.crop}</Text>
      <Text className="text-gray-500">{report.date}</Text>

      <Text className="text-lg mt-2 font-semibold text-red-600">Disease: {report.disease}</Text>
      <Text className="text-gray-700">Confidence: {report.confidence}</Text>
      <Text className="text-gray-700">Pest Info: {report.pest}</Text>

      <Text className="text-md font-semibold mt-2">💊 Immediate Treatment:</Text>
      <Text className="text-gray-700">{report.treatment}</Text>

      <Text className="text-md font-semibold mt-2">🌿 Natural Remedies / IPM:</Text>
      <Text className="text-gray-700">{report.remedies}</Text>

      <Text className="text-md font-semibold mt-2">🛡️ Prevention Steps:</Text>
      <Text className="text-gray-700">{report.prevention}</Text>

      <TouchableOpacity
        onPress={handleShare}
        className="mt-4 bg-green-200 py-2 px-4 rounded-xl"
      >
        <Text className="text-center font-semibold text-green-800">📤 Share Report</Text>
      </TouchableOpacity>
    </View>
  );
}
