/**
 * Componente de formulário de login
 * Gerencia o estado e validação do formulário de login
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CustomInput, CustomButton, LoadingSpinner } from '../global';
import { ThemedText } from '../ThemedText';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegister: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onNavigateToRegister,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Validação do formulário
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onLogin(email.trim(), password);
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Bem-vindo</ThemedText>
        <ThemedText style={styles.subtitle}>
          Faça login para acessar o sistema de ponto
        </ThemedText>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={errors.email}
        />

        <CustomInput
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        <CustomButton
          title="Entrar"
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.loginButton}
        />

        <CustomButton
          title="Criar conta"
          onPress={onNavigateToRegister}
          variant="secondary"
          style={styles.registerButton}
        />
      </View>

      {isLoading && (
        <LoadingSpinner
          text="Fazendo login..."
          fullScreen
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 12,
  },
  registerButton: {
    marginBottom: 20,
  },
}); 