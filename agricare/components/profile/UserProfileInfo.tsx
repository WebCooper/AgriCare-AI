import { format } from 'date-fns';
import { View, Text, StyleSheet } from 'react-native';

interface UserInfoProps {
  email: string;
  isActive: boolean;
  createdAt: string;
  isLoading: boolean;
}

const UserProfileInfo = ({ email, isActive, createdAt, isLoading }: UserInfoProps) => {
  // Format the date to a more readable format
  const formattedDate = createdAt 
    ? format(new Date(createdAt), 'MMMM dd, yyyy')
    : '';

  if (isLoading) {
    return (
      <View className="py-2">
        <Text className="text-lg font-bold mb-4">👤 User Information</Text>
        <View className="bg-gray-100 h-6 rounded animate-pulse mb-2" />
        <View className="bg-gray-100 h-6 rounded animate-pulse mb-2" />
        <View className="bg-gray-100 h-6 rounded animate-pulse" />
      </View>
    );
  }

  return (
    <View className="py-2">
      <Text className="text-lg font-bold mb-4">👤 User Information</Text>
      
      <View className="mb-4">
        <Text className="text-gray-500 mb-1">Email</Text>
        <Text className="text-base">{email}</Text>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-500 mb-1">Status</Text>
        <View className="flex-row items-center">
          <View 
            className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} 
          />
          <Text className="text-base">{isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-500 mb-1">Joined Since</Text>
        <Text className="text-base">{formattedDate}</Text>
      </View>
    </View>
  );
};

export default UserProfileInfo;
