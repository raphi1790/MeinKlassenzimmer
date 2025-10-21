import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  debug(message: string, ...args: any[]) {
    if (environment.enableDebugLogs) {
      console.log(`🔍 ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (environment.enableDebugLogs) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    console.warn(`⚠️ ${message}`, ...args);
  }

  error(message: string, error?: any) {
    console.error(`❌ ${message}`, error);
  }

  // Special method for authentication events
  auth(message: string, ...args: any[]) {
    if (environment.enableDebugLogs) {
      console.log(`🔐 ${message}`, ...args);
    }
  }

  // Special method for database operations
  db(message: string, ...args: any[]) {
    if (environment.enableDebugLogs) {
      console.log(`📊 ${message}`, ...args);
    }
  }
}