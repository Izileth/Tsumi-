import { Stack } from 'expo-router';

export default function PasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="forgot-password" options={{ title: 'Esqueci minha senha', headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="reset-password"  options={{ title: 'Redefinir senha', headerShown: false, gestureEnabled: true }}/>
    </Stack>
  );
}
