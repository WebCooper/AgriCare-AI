import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    Alert.alert(
      'Register',
      `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPassword: ${password}`
    );
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-8 text-green-700">Register</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-green-700 py-3 rounded-lg items-center"
        onPress={handleRegister}
      >
        <Text className="text-white text-base font-semibold">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;