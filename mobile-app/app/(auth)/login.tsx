import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    // Call OTP service here
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    router.replace('/(tabs)');
    // Verify OTP and navigate to home
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
            <Text className="mb-1 font-semibold text-base">📱 Mobile Number</Text>
            <TextInput
              className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
              placeholder="07XXXXXXXX"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />

            {otpSent && (
              <>
                <Text className="mb-1 font-semibold text-base">🔑 Enter OTP</Text>
                <TextInput
                  className="border bg-white rounded-xl px-4 py-3 mb-4 text-base"
                  placeholder="123456"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
              </>
            )}

            <TouchableOpacity
              className="bg-green-600 py-4 rounded-xl mb-4"
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
            >
              <Text className="text-center text-white font-bold text-base">
                {otpSent ? '✅ Verify OTP' : '📨 Send OTP'}
              </Text>
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
