import { Text, View } from 'react-native';

const diseaseTips = [
  { name: 'Tomato Leaf Curl', tip: 'Remove infected plants and apply neem oil.' },
  { name: 'Chili Powdery Mildew', tip: 'Use sulfur-based spray every 7 days.' },
  { name: 'Paddy Blast', tip: 'Avoid excess nitrogen. Apply tricyclazole early.' },
  { name: 'Banana Sigatoka', tip: 'Prune old leaves and apply fungicide.' },
  { name: 'Coconut Bud Rot', tip: 'Use Bordeaux mixture. Remove damaged buds.' },
  { name: 'Mango Anthracnose', tip: 'Spray copper fungicide during flowering.' },
  { name: 'Brinjal Shoot Borer', tip: 'Use pheromone traps and neem-based sprays.' },
  { name: 'Okra Yellow Vein', tip: 'Remove infected plants. Use virus-resistant varieties.' },
  { name: 'Peanut Rust', tip: 'Apply mancozeb at early signs.' },
  { name: 'Carrot Root Knot Nematode', tip: 'Solarize soil before planting.' },
];

export default function OfflineTipsList() {
  return (
    <View className="bg-white rounded-xl p-4 shadow mb-6">
      <Text className="text-lg font-bold mb-3">Top 10 Disease Tips</Text>
      {diseaseTips.map((item, index) => (
        <View key={index} className="mb-3">
          <Text className="font-semibold">• {item.name}</Text>
          <Text className="text-sm text-gray-600">{item.tip}</Text>
        </View>
      ))}
    </View>
  );
}
