/**
 * Serviço de autenticação
 * Gerencia o estado do usuário logado e operações de autenticação
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { databaseService, User } from './DatabaseService';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((state: AuthState) => void)[] = [];

  // Inicializar serviço
  async init(): Promise<void> {
    try {
      // Inicializar banco de dados
      await databaseService.init();
      
      // Verificar se há usuário salvo
      const savedUser = await this.getSavedUser();
      if (savedUser) {
        this.currentUser = savedUser;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Erro ao inicializar AuthService:', error);
      throw error;
    }
  }

  // Registrar listener para mudanças de estado
  addListener(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Retornar função para remover listener
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notificar listeners sobre mudanças
  private notifyListeners(): void {
    const state: AuthState = {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false,
    };

    this.listeners.forEach(listener => listener(state));
  }

  // Fazer login
  async login(email: string, password: string): Promise<User> {
    try {
      // Buscar usuário no banco
      const user = await databaseService.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha (em produção, usar hash)
      if (user.password !== password) {
        throw new Error('Senha incorreta');
      }
      // Salvar usuário logado
      this.currentUser = user;
      await this.saveUser(user);
      this.notifyListeners();

      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Fazer cadastro
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      // Verificar se email já existe
      const existingUser = await databaseService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Criar usuário
      const user = await databaseService.createUser({
        name,
        email,
        password,
      });

      return user;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  // Configurar reconhecimento facial
  async setupFaceRecognition(userId: number, faceData: string): Promise<void> {
    try {
      await databaseService.updateUserFaceData(userId, faceData);
      
      // Atualizar usuário atual se for o mesmo
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.faceData = faceData;
        await this.saveUser(this.currentUser);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Erro ao configurar reconhecimento facial:', error);
      throw error;
    }
  }

  // Fazer logout
  async logout(): Promise<void> {
    try {
      this.currentUser = null;
      await AsyncStorage.removeItem('currentUser');
      this.notifyListeners();
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Salvar usuário no AsyncStorage
  private async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  }

  // Obter usuário salvo do AsyncStorage
  private async getSavedUser(): Promise<User | null> {
    try {
      const savedUser = await AsyncStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Converter string de data de volta para Date
        user.createdAt = new Date(user.createdAt);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário salvo:', error);
      return null;
    }
  }

  // Verificar se usuário tem reconhecimento facial configurado
  hasFaceRecognition(): boolean {
    return !!(this.currentUser?.faceData);
  }

  // Atualizar dados do usuário atual
  async updateCurrentUser(updates: Partial<User>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Nenhum usuário logado');
    }

    this.currentUser = { ...this.currentUser, ...updates };
    await this.saveUser(this.currentUser);
    this.notifyListeners();
  }
}

// Instância singleton do serviço
export const authService = new AuthService(); 