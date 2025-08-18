/**
 * Layout específico para as telas de autenticação
 * Configura a navegação e aparência das telas de login e cadastro
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F2F2F7' },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Cadastro',
        }}
      />
      <Stack.Screen
        name="face-recognition"
        options={{
          title: 'Reconhecimento Facial',
          contentStyle: { backgroundColor: '#000000' },
        }}
      />
    </Stack>
  );
} 