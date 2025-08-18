/**
 * Serviço de banco de dados local
 * Simula um banco MySQL usando SQLite para armazenar dados dos usuários e pontos
 */

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  faceData?: string; // Dados faciais em base64
  createdAt: Date;
}

export interface TimeRecord {
  id: number;
  userId: number;
  photoUri: string;
  timestamp: Date;
  latitude?: number;
  longitude?: number;
  isUserIdentified: boolean;
  createdAt: Date;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  // Inicializar banco de dados
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('menzem.db');
      await this.createTables();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  // Criar tabelas
  private async createTables(): Promise<void> {
    if (!this.db) return;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        faceData TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createTimeRecordsTable = `
      CREATE TABLE IF NOT EXISTS time_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        photoUri TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        latitude REAL,
        longitude REAL,
        isUserIdentified BOOLEAN NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `;

    try {
      await this.db.execAsync(createUsersTable);
      await this.db.execAsync(createTimeRecordsTable);
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
      throw error;
    }
  }

  // Criar usuário
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = `
      INSERT INTO users (name, email, password, faceData)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const result = await this.db.runAsync(query, [
        user.name,
        user.email,
        user.password,
        user.faceData || null,
      ]);

      return {
        id: result.lastInsertRowId,
        name: user.name,
        email: user.email,
        password: user.password,
        faceData: user.faceData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = 'SELECT * FROM users WHERE email = ?';

    try {
      const result = await this.db.getAllAsync(query, [email]);
      return result.length > 0 ? this.mapUserFromResult(result[0]) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Atualizar dados faciais do usuário
  async updateUserFaceData(userId: number, faceData: string): Promise<void> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = 'UPDATE users SET faceData = ? WHERE id = ?';

    try {
      await this.db.runAsync(query, [faceData, userId]);
    } catch (error) {
      console.error('Erro ao atualizar dados faciais:', error);
      throw error;
    }
  }

  // Criar registro de ponto
  async createTimeRecord(record: Omit<TimeRecord, 'id' | 'createdAt'>): Promise<TimeRecord> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = `
      INSERT INTO time_records (userId, photoUri, timestamp, latitude, longitude, isUserIdentified)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await this.db.runAsync(query, [
        record.userId,
        record.photoUri,
        record.timestamp.toISOString(),
        record.latitude || null,
        record.longitude || null,
        record.isUserIdentified ? 1 : 0,
      ]);

      return {
        id: result.lastInsertRowId,
        userId: record.userId,
        photoUri: record.photoUri,
        timestamp: record.timestamp,
        latitude: record.latitude,
        longitude: record.longitude,
        isUserIdentified: record.isUserIdentified,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Erro ao criar registro de ponto:', error);
      throw error;
    }
  }

  // Buscar registros de ponto por usuário
  async getTimeRecordsByUser(userId: number): Promise<TimeRecord[]> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = `
      SELECT * FROM time_records 
      WHERE userId = ? 
      ORDER BY timestamp DESC
    `;

    try {
      const result = await this.db.getAllAsync(query, [userId]);
      return result.map(this.mapTimeRecordFromResult);
    } catch (error) {
      console.error('Erro ao buscar registros de ponto:', error);
      throw error;
    }
  }

  // Buscar todos os registros de ponto
  async getAllTimeRecords(): Promise<TimeRecord[]> {
    if (!this.db) throw new Error('Banco de dados não inicializado');

    const query = `
      SELECT tr.*, u.name as userName 
      FROM time_records tr
      JOIN users u ON tr.userId = u.id
      ORDER BY tr.timestamp DESC
    `;

    try {
      const result = await this.db.getAllAsync(query);
      return result.map(this.mapTimeRecordFromResult);
    } catch (error) {
      console.error('Erro ao buscar todos os registros:', error);
      throw error;
    }
  }

  // Mapear resultado para objeto User
  private mapUserFromResult(result: any): User {
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      password: result.password,
      faceData: result.faceData,
      createdAt: new Date(result.createdAt),
    };
  }

  // Mapear resultado para objeto TimeRecord
  private mapTimeRecordFromResult(result: any): TimeRecord {
    return {
      id: result.id,
      userId: result.userId,
      photoUri: result.photoUri,
      timestamp: new Date(result.timestamp),
      latitude: result.latitude,
      longitude: result.longitude,
      isUserIdentified: Boolean(result.isUserIdentified),
      createdAt: new Date(result.createdAt),
    };
  }

  // Fechar conexão com banco
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Instância singleton do serviço
export const databaseService = new DatabaseService(); 