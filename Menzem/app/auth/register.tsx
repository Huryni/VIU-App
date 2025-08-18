/**
 * Tela de cadastro do sistema de bater ponto
 * Gerencia o registro do usuário e navegação para reconhecimento facial
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { RegisterForm } from '../../components/local/RegisterForm';
import { ThemedView } from '../../components/ThemedView';

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o cadastro do usuário
  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    
    try {
      // TODO: Implementar integração com backend/banco de dados
      // Por enquanto, simulamos um cadastro bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simula verificação se email já existe
      if (email === 'teste@exemplo.com') {
        throw new Error('Email já cadastrado');
      }
      
      // TODO: Salvar dados do usuário no banco
      // TODO: Navegar para tela de reconhecimento facial
      Alert.alert(
        'Sucesso', 
        'Conta criada com sucesso! Agora você será direcionado para configurar o reconhecimento facial.',
        [
          {
            text: 'OK',
            onPress: () => {
              // TODO: Navegar para tela de reconhecimento facial
              router.push('/auth/face-recognition');
            }
          }
        ]
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Email já cadastrado') {
        Alert.alert('Erro', 'Este email já está cadastrado. Tente outro email.');
      } else {
        Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para navegar para a tela de login
  const handleNavigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <ThemedView style={styles.container}>
      <RegisterForm
        onRegister={handleRegister}
        onNavigateToLogin={handleNavigateToLogin}
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