/**
 * Tela de dashboard do sistema de bater ponto
 * Tela principal após o login do usuário com captura automática
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { CustomButton } from '../../components/global';
import { AutoCapture } from '../../components/local/AutoCapture';

interface PhotoData {
  uri: string;
  timestamp: Date;
  location: any;
  isUserIdentified: boolean;
}

export default function DashboardScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoData[]>([]);

  // Função para lidar com fotos capturadas
  const handlePhotoCaptured = (photoData: PhotoData) => {
    setCapturedPhotos(prev => [...prev, photoData]);
    
    // TODO: Salvar no banco de dados
    console.log('Foto capturada:', photoData);
    
    if (photoData.isUserIdentified) {
      Alert.alert('Sucesso', 'Ponto registrado com sucesso!');
    } else {
      Alert.alert('Aviso', 'Pessoa não identificada. Ponto não registrado.');
    }
  };

  // Função para lidar com erros
  const handleError = (error: string) => {
    Alert.alert('Erro', error);
  };

  // Função para mostrar histórico
  const showHistory = () => {
    Alert.alert(
      'Histórico de Pontos',
      `Total de fotos capturadas: ${capturedPhotos.length}`,
      [{ text: 'OK' }]
    );
  };

  // Função para logout
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            // TODO: Implementar logout
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  if (showCamera) {
    return (
      <ThemedView style={styles.cameraContainer}>
        <AutoCapture
          onPhotoCaptured={handlePhotoCaptured}
          onError={handleError}
          intervalMinutes={5}
        />
        <View style={styles.cameraControls}>
          <CustomButton
            title="Voltar ao Dashboard"
            onPress={() => setShowCamera(false)}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sistema de Bater Ponto
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.welcomeText}>
          Bem-vindo ao sistema de bater ponto!
        </ThemedText>
        
        <ThemedText style={styles.infoText}>
          O sistema captura fotos automaticamente a cada 5 minutos para registrar seu ponto.
        </ThemedText>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {capturedPhotos.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Fotos Capturadas
            </ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {capturedPhotos.filter(p => p.isUserIdentified).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Pontos Registrados
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Iniciar Captura Automática"
          onPress={() => setShowCamera(true)}
          style={styles.startButton}
        />
        
        <CustomButton
          title="Ver Histórico"
          onPress={showHistory}
          variant="secondary"
          style={styles.historyButton}
        />
        
        <CustomButton
          title="Sair"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000000',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    minWidth: 120,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
  },
  startButton: {
    marginBottom: 12,
  },
  historyButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginBottom: 10,
  },
}); 