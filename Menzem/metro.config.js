/**
 * Configuração do Metro bundler
 * Garante que as dependências sejam resolvidas corretamente
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar resolução de módulos
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configurar resolução de caminhos
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Configurar extensões
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config; 