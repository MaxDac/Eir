import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Character} from './dtos/character';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {ApiException} from './dtos/api-exception';

@Injectable({ providedIn : 'root' })
export class CharacterService {
  constructor(
    private provider: HttpWrapperService,
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private router: Router
  ) {}

  getCharacterByUserId(userId: number): Observable<Character[] | ApiException> {
    return this.provider.get(`/Character/User/${userId}`, this.authenticationService.retrieveStoredSession());
  }

  getCharacterById(id: number): Observable<Character | ApiException> {
    return this.provider.get(`/Character/${id}`, this.authenticationService.retrieveStoredSession());
  }

  getCharacterByRoomId(roomId: number): Observable<Character[] | ApiException> {
    return this.provider.get(`/Character/Room/${roomId}`, this.authenticationService.retrieveStoredSession());
  }

  saveCharacter(c: Character): Observable<any | ApiException> {
    console.log(`Sending for save: ${JSON.stringify(c)}`);
    return this.provider.post('/Character/Save', c, this.authenticationService.retrieveStoredSession());
  }

  updateCharacter(c: any): Observable<any | ApiException> {
    console.log(`sending for update ${JSON.stringify(c)}`);
    return this.provider.post('/Character/Update', c);
  }
}
