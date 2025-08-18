import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { ThemedText } from '../ThemedText';
import { CustomButton, LoadingSpinner } from '../global';

interface AutoCaptureProps {
  onPhotoCaptured: (photoData: {
    uri: string;
    timestamp: Date;
    location: any;
    isUserIdentified: boolean;
  }) => void;
  onError: (error: string) => void;
  intervalMinutes?: number;
}

export const AutoCapture: React.FC<AutoCaptureProps> = ({
  onPhotoCaptured,
  onError,
  intervalMinutes = 5,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [timeUntilNextCapture, setTimeUntilNextCapture] = useState(intervalMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  const cameraRef = useRef<CameraView | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solicitar permissões (câmera via hook; localização imperativa)
  useEffect(() => {
    (async () => {
      if (!permission?.granted && permission?.canAskAgain !== false) {
        await requestPermission();
      }
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
  }, [permission, requestPermission]);

  // Timers de captura automática
  useEffect(() => {
    if (permission?.granted && hasLocationPermission && isActive) {
      startAutoCapture();
    }
    return stopAutoCapture;
  }, [permission?.granted, hasLocationPermission, isActive, intervalMinutes]);

  // Monitorar estado do app
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => setIsActive(s === 'active'));
    return () => sub.remove();
  }, []);

  const startAutoCapture = () => {
    stopAutoCapture();
    initialTimeoutRef.current = setTimeout(capturePhoto, 5000);
    const intervalMs = intervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(capturePhoto, intervalMs);
    setTimeUntilNextCapture(intervalMinutes * 60);
    timerRef.current = setInterval(() => {
      setTimeUntilNextCapture(prev => (prev <= 1 ? intervalMinutes * 60 : prev - 1));
    }, 1000);
  };

  const stopAutoCapture = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (initialTimeoutRef.current) clearTimeout(initialTimeoutRef.current);
    intervalRef.current = timerRef.current = initialTimeoutRef.current = null;
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        skipProcessing: false,
      });

      let location: any = null;
      if (hasLocationPermission) {
        try {
          location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        } catch (err) {
          console.log('Erro ao obter localização:', err);
        }
      }

      onPhotoCaptured({
        uri: photo.uri,
        timestamp: new Date(),
        location,
        isUserIdentified: true,
      });
    } catch (e) {
      console.error('Erro na captura:', e);
      onError('Falha ao capturar foto');
    } finally {
      setIsCapturing(false);
    }
  };

  // Estados de carregamento/permite
  if (!permission || hasLocationPermission === null) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text="Solicitando permissões..." />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionTitle}>Permissão da Câmera</ThemedText>
          <ThemedText style={styles.permissionText}>
            Precisamos do acesso à câmera para capturar as fotos.
          </ThemedText>
          <CustomButton title="Conceder Permissão" onPress={requestPermission} style={styles.permissionButton} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" mode="picture">
        <View style={styles.overlay}>
          <View style={styles.faceFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>

          <View style={styles.statusIndicator}>
            <ThemedText style={styles.statusText}>{isActive ? 'Captura Ativa' : 'Captura Pausada'}</ThemedText>
            <ThemedText style={styles.timerText}>Próxima: {formatTime(timeUntilNextCapture)}</ThemedText>
          </View>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <CustomButton
          title={isActive ? 'Pausar Captura' : 'Retomar Captura'}
          onPress={() => (isActive ? (setIsActive(false), stopAutoCapture()) : (setIsActive(true), startAutoCapture()))}
          variant={isActive ? 'danger' : 'primary'}
          style={styles.toggleButton}
        />
      </View>

      {isCapturing && <LoadingSpinner text="Capturando foto..." fullScreen />}
    </View>
  );
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#007AFF',
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
  statusIndicator: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timerText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  toggleButton: {
    marginBottom: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    marginBottom: 12,
  },
}); 
