import CropPreferences from '@/components/profile/CropPreferences';
import LanguageSelector from '@/components/profile/LanguageSelector';
import OfflineToggle from '@/components/profile/OfflineToggle';
import RegionSelector from '@/components/profile/RegionSelector';
import SyncButton from '@/components/profile/SyncButton';
import UserProfileInfo from '@/components/profile/UserProfileInfo';
import authService from '@/services/authService';
import { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function ProfileScreen() {
  // User preferences
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // User information from API
  const [userInfo, setUserInfo] = useState({
    email: '',
    is_active: false,
    created_at: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userData = await authService.getUserInfo();
        if (userData) {
          setUserInfo({
            email: userData.email,
            is_active: userData.is_active,
            created_at: userData.created_at,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        Alert.alert('Error', 'Failed to load user information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Navigation will be handled by the AuthCheck component in _layout.tsx
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      <Text className="text-2xl font-bold mb-6">Profile & Settings</Text>

      {/* User Info Card */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <UserProfileInfo 
          email={userInfo.email}
          isActive={userInfo.is_active}
          createdAt={userInfo.created_at}
          isLoading={isLoading}
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
      
      {/* Logout Button */}
      <TouchableOpacity 
        className="bg-red-500 py-4 rounded-xl mb-6"
        onPress={handleLogout}
      >
        <Text className="text-center text-white font-bold text-base">
          🚪 Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
