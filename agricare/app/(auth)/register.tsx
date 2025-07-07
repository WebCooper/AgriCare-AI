import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
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
import authService from '@/services/authService';
import api from '@/config/axios';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; url: string }>({ connected: false, url: '' });

  // Check API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Try to ping the API server
        setApiStatus({ connected: false, url: api.defaults.baseURL || 'Unknown' });
        
        // Simple health check request - adjust endpoint as needed
        await api.get('/health-check').catch(async () => {
          // If health-check fails, try to access the root endpoint
          await api.get('/');
        });
        
        setApiStatus({ connected: true, url: api.defaults.baseURL || 'Unknown' });
      } catch (error) {
        console.error('API connection error:', error);
        setApiStatus({ connected: false, url: api.defaults.baseURL || 'Unknown' });
        Alert.alert(
          'Connection Error',
          `Cannot connect to server at ${api.defaults.baseURL}. Please check your network settings and ensure the server is running.`
        );
      }
    };

    checkApiConnection();
  }, []);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Check API connection status
    if (!apiStatus.connected) {
      Alert.alert(
        'Connection Error',
        `Cannot connect to server at ${apiStatus.url}. Please check your network settings and ensure the server is running.`,
        [
          { text: 'Retry', onPress: () => {
            // Force a re-render to trigger the useEffect
            setApiStatus(prev => ({ ...prev }));
          }}
        ]
      );
      return;
    }
    
    try {
      setIsLoading(true);
      console.log(`Attempting to register with server at: ${api.defaults.baseURL}`);
      await authService.register(email, password);
      Alert.alert('Success', 'Registration successful', [
        { text: 'OK', onPress: () => router.push('/(auth)/login') }
      ]);
    } catch (error: any) {
      console.error('Registration error in component:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message === 'Network Error') {
        errorMessage = `Network error connecting to ${api.defaults.baseURL}. Please check your network connection and server status.`;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
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
            source={require('../../assets/images/register.png')}
            className="w-64 h-64 mb-8"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold mb-6 text-center">📝 Create Your Account</Text>

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

            <Text className="mb-1 font-semibold text-base">🔒 Password</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text className="mb-1 font-semibold text-base">� Confirm Password</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              className="bg-green-600 py-4 rounded-xl mb-4"
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-bold text-base">
                  ✅ Register Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-6">
            <Text className="text-blue-600 text-base">
              Already have an account? <Text className="underline">Login</Text>
            </Text>
          </TouchableOpacity>

          {/* API Connection Status */}
          <View className="mt-4 flex-row items-center">
            <View className={`w-3 h-3 rounded-full mr-2 ${apiStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="text-gray-500 text-sm">
              Server: {apiStatus.connected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}