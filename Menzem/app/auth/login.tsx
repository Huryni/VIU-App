/**
 * Tela de login do sistema de bater ponto
 * Gerencia a autenticação do usuário e navegação para cadastro
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { LoginForm } from '../../components/local/LoginForm';
import { ThemedView } from '../../components/ThemedView';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o login do usuário
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // TODO: Implementar integração com backend/banco de dados
      // Por enquanto, simulamos um login bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simula verificação de credenciais
      if (email === 'teste@exemplo.com' && password === '123456') {
        // TODO: Salvar token de autenticação
        // TODO: Navegar para o dashboard
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        router.replace('/dashboard');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para navegar para a tela de cadastro
  const handleNavigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <ThemedView style={styles.container}>
      <LoginForm
        onLogin={handleLogin}
        onNavigateToRegister={handleNavigateToRegister}
        isLoading={isLoading}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
}); 