import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {SESSION_COOKIE_KEY} from '../base/constants';
import {ApiException} from './dtos/api-exception';

@Injectable()
export class LogoutService {
  constructor(
    private cookieService: CookieService,
    private storageService: StorageService,
    private router: Router
  ) { }

  private deleteStoredSession() {
    this.cookieService.delete(SESSION_COOKIE_KEY);
  }

  logout(error?: ApiException) {
    this.deleteStoredSession();
    this.storageService.clearCache();
    this.router.navigate(['login'], {
      state: error
    });
  }
}
