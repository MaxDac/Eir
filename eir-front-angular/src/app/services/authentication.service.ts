import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationRequest} from './dtos/authentication-request';
import {SessionTokens} from './dtos/session-tokens';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {isNull} from '../helpers';
import {ApiException, isError} from './dtos/api-exception';
import {SESSION_COOKIE_KEY} from '../base/constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private provider: HttpWrapperService,
    private cookieService: CookieService
  ) { }

  private storeSession(session: SessionTokens) {
    this.cookieService.set(SESSION_COOKIE_KEY, JSON.stringify(session));
  }

  changeCharacter(characterId: number, characterName?: string) {
    const oldSession = this.retrieveStoredSession();
    const newCharacterName = isNull(characterName) ? oldSession.characterName : characterName;
    this.storeSession({
      headerToken: oldSession.headerToken,
      cookieToken: oldSession.cookieToken,
      userId: oldSession.userId,
      characterId,
      characterName: newCharacterName
    });
  }

  retrieveStoredSession(): SessionTokens | null {
    try {
      const value = this.cookieService.get(SESSION_COOKIE_KEY);
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  login(request: AuthenticationRequest): Observable<SessionTokens | ApiException> {
    return this.provider.post<SessionTokens>('/Login', request)
      .map(x => {
        if (!isError(x)) {
          this.storeSession(x as SessionTokens);
        }

        return x;
      });
  }
}
