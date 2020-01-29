import {Injectable} from '@angular/core';
import {isNull} from '../helpers';

export enum StorageMode {
  SESSION,
  PERSISTENT
}

@Injectable()
export class StorageService {
  private getMedium(mode: StorageMode): Storage {
    if (mode === StorageMode.SESSION) {
      return sessionStorage;
    } else {
      return localStorage;
    }
  }

  getString(key: string, mode: StorageMode = StorageMode.SESSION): string | null {
    return this.getMedium(mode).getItem(key);
  }

  get<T>(key: string, mode: StorageMode = StorageMode.SESSION): T | null {
    const item = this.getString(key, mode);
    if (isNull(item)) { return null; } else { return JSON.parse(item); }
  }

  store(key: string, data: any, mode: StorageMode = StorageMode.SESSION) {
    this.getMedium(mode).setItem(key, data);
  }

  delete(key: string, mode: StorageMode = StorageMode.SESSION) {
    this.getMedium(mode).removeItem(key);
  }

  clearCache() {
    sessionStorage.clear();
    localStorage.clear();
  }
}
