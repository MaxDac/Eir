import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Character} from './dtos/character';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';

@Injectable({ providedIn : 'root' })
export class CharacterService {
  constructor(
    private provider: HttpWrapperService,
    private authenticationService: AuthenticationService
  ) {}

  getCharacterByUserId(userId: number): Observable<Character[]> {
    return this.provider.get(`/Character/User/${userId}`, this.authenticationService.retrieveStoredSession());
  }

  getCharacterById(id: number): Observable<Character> {
    return this.provider.get(`/Character/${id}`, this.authenticationService.retrieveStoredSession());
  }

  saveCharacter(c: Character): Observable<any> {
    console.log(`Sending for save: ${JSON.stringify(c)}`);
    return this.provider.post('/Character/Save', c, this.authenticationService.retrieveStoredSession());
  }
}
