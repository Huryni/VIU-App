/**
 * Tela de reconhecimento facial para cadastro
 * Captura a foto do usuário para configuração do reconhecimento facial
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import FaceCapture from '../../components/local/FaceCapture';
import { ThemedView } from '../../components/ThemedView';

export default function FaceRecognitionScreen() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para lidar com a foto capturada
  const handleFaceCaptured = async (photoUri: string) => {
    setIsProcessing(true);
    
    try {
      // TODO: Implementar processamento da foto
      // - Validar qualidade da imagem
      // - Extrair características faciais
      // - Salvar no banco de dados
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula processamento
      
      Alert.alert(
        'Sucesso!',
        'Reconhecimento facial configurado com sucesso!',
        [
          {
            text: 'Continuar',
            onPress: () => {
              // TODO: Navegar para o dashboard ou tela de configuração adicional
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar a foto. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para cancelar o reconhecimento facial
  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      'Tem certeza que deseja cancelar a configuração do reconhecimento facial?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            // TODO: Voltar para a tela de cadastro ou login
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FaceCapture
        onFaceCaptured={handleFaceCaptured}
        onCancel={handleCancel}
        title="Configurar Reconhecimento Facial"
        subtitle="Posicione seu rosto na área indicada e mantenha-se imóvel"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
}); 