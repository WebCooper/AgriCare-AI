import CropPreferences from '@/components/profile/CropPreferences';
import LanguageSelector from '@/components/profile/LanguageSelector';
import OfflineToggle from '@/components/profile/OfflineToggle';
import RegionSelector from '@/components/profile/RegionSelector';
import SyncButton from '@/components/profile/SyncButton';
import UserInfoSection from '@/components/profile/UserInfoSection';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [userType, setUserType] = useState('farmer');

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      <Text className="text-2xl font-bold mb-6">Profile & Settings</Text>

      {/* Section Card */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <UserInfoSection
          name={fullName}
          onNameChange={setFullName}
          phone={mobile}
          onPhoneChange={setMobile}
          userType={userType}
          onUserTypeChange={setUserType}
        />
      </View>

      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-bold mb-4">🌐 Preferences</Text>
        <LanguageSelector selected={language} onChange={setLanguage} />
        <RegionSelector value={region} onChange={setRegion} />
        <CropPreferences selected={selectedCrops} onToggle={toggleCrop} />
      </View>

      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-bold mb-4">⚙️ App Settings</Text>
        <OfflineToggle enabled={offlineMode} onToggle={() => setOfflineMode(!offlineMode)} />
        <SyncButton />
      </View>
    </ScrollView>
  );
}
