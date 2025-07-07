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
  ActivityIndicator
} from 'react-native';
import authService from '@/services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await authService.login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
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
            source={require('../../assets/images/login.png')}
            className="w-64 h-64 mb-8"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold mb-6 text-center">🔐 Welcome Back</Text>

          <View className="w-full">
            <Text className="mb-1 font-semibold text-base">✉️ Email Address</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="mb-1 font-semibold text-base">� Password</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              className="bg-green-600 py-4 rounded-xl mb-4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-bold text-base">
                  � Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="mt-6">
            <Text className="text-blue-600 text-base">Don't have an account? <Text className="underline">Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
