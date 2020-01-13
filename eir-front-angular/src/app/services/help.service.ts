import {Injectable} from '@angular/core';
import HttpWrapperService from './http-wrapper.service';
import {Observable} from 'rxjs';
import Characteristic from './dtos/characteristic';

@Injectable({ providedIn : 'root' })
export class HelpService {
  constructor(private provider: HttpWrapperService) {}

  getCharacteristics(): Observable<Characteristic[]> {
    return this.provider.get('/Characteristics');
  }

  getAbilities(): Observable<Characteristic[]> {
    return this.provider.get('/Abilities');
  }
}
