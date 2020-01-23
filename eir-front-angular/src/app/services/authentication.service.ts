import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationRequest} from './dtos/authentication-request';
import {SessionTokens} from './dtos/session-tokens';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly SESSION_COOKIE_KEY: string = 'x-session-storage';

  constructor(
    private provider: HttpWrapperService,
    private cookieService: CookieService
  ) { }

  private storeSession(session: SessionTokens) {
    this.cookieService.set(this.SESSION_COOKIE_KEY, JSON.stringify(session));
  }

  retrieveStoredSession(): SessionTokens | null {
    try {
      const value = this.cookieService.get(this.SESSION_COOKIE_KEY);
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  login(request: AuthenticationRequest): Observable<SessionTokens> {
    return this.provider.post<SessionTokens>('/Login', request)
      .map(x => {
        this.storeSession(x);
        return x;
      });
  }
}
