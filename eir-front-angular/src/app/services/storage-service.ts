import {Injectable} from '@angular/core';
import {isNull} from '../helpers';

@Injectable()
export class StorageService {
  getString(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  get<T>(key: string): T | null {
    const item = this.getString(key);
    if (isNull(item)) { return null; } else { return JSON.parse(item); }
  }

  store(key: string, data: any) {
    const request = JSON.stringify(data);
    console.info(`storing: ${request}`);
    sessionStorage.setItem(key, data);
  }

  delete(key: string) {
    sessionStorage.removeItem(key);
  }
}
