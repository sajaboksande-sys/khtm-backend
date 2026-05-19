import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="taxi" />
      <Stack.Screen name="delivery" />
      <Stack.Screen name="driver/dashboard" />
    </Stack>
  );
}