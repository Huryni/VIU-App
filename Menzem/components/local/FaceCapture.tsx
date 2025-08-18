import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions, type CameraCapturedPicture } from 'expo-camera';
import { ThemedText } from '../ThemedText';
import { CustomButton, LoadingSpinner } from '../global';

interface FaceCaptureProps {
  onFaceCaptured: (photoUri: string) => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export const FaceCapture: React.FC<FaceCaptureProps> = ({
  onFaceCaptured,
  onCancel,
  title = 'Reconhecimento Facial',
  subtitle = 'Posicione seu rosto na área indicada',
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain !== false) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    const camera = cameraRef.current;
    if (!camera) {
      Alert.alert('Erro', 'Câmera não disponível.');
      return;
    }

    setIsCapturing(true);
    try {
      const photo: CameraCapturedPicture = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) onFaceCaptured(photo.uri);
      else Alert.alert('Erro', 'Não foi possível capturar a imagem.');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao capturar foto. Tente novamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text="Solicitando permissão da câmera..." />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionTitle}>Permissão da Câmera Necessária</ThemedText>
          <ThemedText style={styles.permissionText}>
            Para continuar com o cadastro, é necessário permitir o acesso à câmera.
          </ThemedText>
          <CustomButton title="Conceder Permissão" onPress={requestPermission} style={styles.permissionButton} />
          <CustomButton title="Cancelar" onPress={onCancel} variant="secondary" style={styles.cancelButton} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        enableTorch={false}
        mode="picture"
      >
        <View style={styles.overlay}>
          <View style={styles.faceFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Capturar Foto"
            onPress={handleCapture}
            disabled={isCapturing}
            style={styles.captureButton}
          />
          <CustomButton
            title="Cancelar"
            onPress={onCancel}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>

        {isCapturing && <LoadingSpinner text="Capturando foto..." />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00BFFF',
    top: -2,
    left: -2,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -2,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    marginRight: 6,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 6,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    marginBottom: 12,
  },
});
