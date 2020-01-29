import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {Characteristic} from './dtos/characteristic';
import {Race} from './dtos/race';
import {CharacterType} from './dtos/character-type';
import {Perk} from './dtos/perk';
import {ApiException} from './dtos/api-exception';
import {SessionTokens} from './dtos/session-tokens';

@Injectable({ providedIn : 'root' })
export class HelpService {
  constructor(private provider: HttpWrapperService) {}

  getCharacteristics(): Observable<Characteristic[] | ApiException> {
    return this.provider.get('/Characteristics');
  }

  getAbilities(): Observable<Characteristic[] | ApiException> {
    return this.provider.get('/Abilities');
  }

  getRaces(): Observable<Race[] | ApiException> {
    return this.provider.get('/Races');
  }

  getCharacteristicTypes(): Observable<CharacterType[] | ApiException> {
    return this.provider.get('/CharacterTypes');
  }

  getPerks(): Observable<Perk[] | ApiException> {
    return this.provider.get('/Perks');
  }
}
