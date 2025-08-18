/**
 * Tela inicial do aplicativo
 * Redireciona para a tela de login
 */

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redireciona para a tela de login
    router.replace('/auth/login');
  }, []);

  return null;
} 