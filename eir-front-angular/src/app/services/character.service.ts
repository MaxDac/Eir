import {Injectable} from '@angular/core';
import HttpWrapperService from './http-wrapper.service';
import {Character} from './dtos/character';
import {Observable} from 'rxjs';

@Injectable({ providedIn : 'root' })
export class CharacterService {
  constructor(private provider: HttpWrapperService) {}

  saveCharacter(c: Character): Observable<any> {
    return this.provider.post('/Character/Save', c);
  }
}
