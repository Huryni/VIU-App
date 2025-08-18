/**
 * Componente de botão personalizado reutilizável
 * Permite criar botões com diferentes estilos e funcionalidades
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '../ThemedText';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  // Define as cores baseadas na variante do botão
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    
    switch (variant) {
      case 'secondary':
        return [baseStyle, styles.secondaryButton];
      case 'danger':
        return [baseStyle, styles.dangerButton];
      default:
        return [baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = styles.text;
    
    switch (variant) {
      case 'secondary':
        return [baseTextStyle, styles.secondaryText];
      case 'danger':
        return [baseTextStyle, styles.dangerText];
      default:
        return [baseTextStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <ThemedText style={[getTextStyle(), textStyle]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
}); 