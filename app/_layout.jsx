import { Stack } from 'expo-router';
import AuthProvider from '../context/AuthProvider';


export default function RootLayout () {
  return (
    <AuthProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(dashboard)" options={{headerShown: false}} />
      </Stack>
    </AuthProvider>
  )
}
