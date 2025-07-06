import UserTypeSelector from '@/components/auth/UserTypeSelector';
import { auth } from '@/config/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('farmer');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await auth.register(email, password, userType);

      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => router.push('/(auth)/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-6 py-10">
          <Image
            source={require('../../assets/images/register.png')}
            className="w-64 h-64 mb-8"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold mb-6 text-center">📝 Create Your Account</Text>

          <View className="w-full">
            <Text className="mb-1 font-semibold text-base">📧 Email</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="mb-1 font-semibold text-base">🔒 Password</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <UserTypeSelector selected={userType} onChange={setUserType} />

            <TouchableOpacity
              className={`bg-green-600 py-4 rounded-xl mb-4 flex-row justify-center ${
                loading ? 'opacity-50' : ''
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-bold text-base">Register</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-6">
            <Text className="text-blue-600 text-base">
              Already have an account? <Text className="underline">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
