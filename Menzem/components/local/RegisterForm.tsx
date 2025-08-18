/**
 * Componente de formulário de cadastro
 * Gerencia o estado e validação do formulário de registro
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CustomInput, CustomButton, LoadingSpinner } from '../global';
import { ThemedText } from '../ThemedText';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  onNavigateToLogin: () => void;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onNavigateToLogin,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validação do formulário
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o cadastro
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onRegister(name.trim(), email.trim(), password, confirmPassword);
    } catch (error) {
      Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Criar Conta</ThemedText>
        <ThemedText style={styles.subtitle}>
          Preencha os dados para criar sua conta
        </ThemedText>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Nome completo"
          placeholder="Digite seu nome completo"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

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

        <CustomInput
          label="Confirmar senha"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />

        <CustomButton
          title="Criar conta"
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.registerButton}
        />

        <CustomButton
          title="Já tenho conta"
          onPress={onNavigateToLogin}
          variant="secondary"
          style={styles.loginButton}
        />
      </View>

      {isLoading && (
        <LoadingSpinner
          text="Criando conta..."
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
  registerButton: {
    marginTop: 20,
    marginBottom: 12,
  },
  loginButton: {
    marginBottom: 20,
  },
}); 