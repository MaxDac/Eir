import {Characteristic, MartialAttribute, MentalAttribute} from '../../services/dtos/characteristic';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Character} from '../../services/dtos/character';

export const CHARACTER_COOKIE_KEY = 'app-character';

export function divideCharacteristics(cs: Characteristic[]) {
  const martials = cs.filter(c => c.type === MartialAttribute);
  const mentals = cs.filter(c => c.type === MentalAttribute);
  const result = [];

  // tslint:disable-next-line:forin
  for (const i in martials) {
    result.push(martials[i]);
    result.push(mentals[i]);
  }

  return result;
}

export function last<T>(ls: T[]): T {
  return ls[ls.length - 1];
}

export function tryParse<T>(serialized: string): T | null {
  try {
    const returnValue = JSON.parse(serialized) as T;
    if (returnValue === null || returnValue === undefined) {
      return null;
    } else {
      return returnValue;
    }
  } catch (e) {
    return null;
  }
}

export function isNull(s: any): boolean {
  return s === undefined || s === null;
}

export function isNullOrEmpty(s: string): boolean {
  return isNull(s) || s === '';
}

export function resetCache(service: CookieService) {
  service.delete(CHARACTER_COOKIE_KEY);
}

export function setCharacterState(service: CookieService, character: Character) {
  service.set(CHARACTER_COOKIE_KEY, JSON.stringify(character));
}

export function mapCharacteristicForSave(c: Characteristic): Characteristic {
  return {
    id: c.id,
    name: c.name,
    comments: '',
    type: '',
    value: c.value
  };
}

export function checkCharacterState(service: CookieService, router: Router, step: number): Character | null {
  const returnToStart = (r: Router) => {
    if (step !== 0) {
      r.navigate(['sheet/creation']);
    }
  };

  const goToLink = (r: Router, url: string, c: Character) => {
    r.navigate([url], {
      state: c
    });
  };

  const serializedCharacter = service.get(CHARACTER_COOKIE_KEY);

  if (serializedCharacter === undefined || serializedCharacter === null || serializedCharacter === '') {
    returnToStart(router);
    return null;
  }

  const character = tryParse<Character>(serializedCharacter);
  if (character === null) {
    console.log('Failed to deserialize character');
    returnToStart(router);
    return null;
  }

  const hasFirstStep = !isNullOrEmpty(character.name) &&
    !isNull(character.type) &&
    !isNull(character.race);

  const hasSecondStep = hasFirstStep &&
    !isNull(character.martialAttributes) &&
    character.martialAttributes.length > 0 &&
    !isNull(character.mentalAttributes) &&
    character.mentalAttributes.length > 0;

  const hasThirdStep = hasFirstStep &&
    hasSecondStep &&
    !isNull(character.martialAbilities) &&
    character.martialAbilities.length > 0 &&
    !isNull(character.mentalAbilities) &&
    character.mentalAbilities.length > 0;

  const hasFourthStep = hasFirstStep &&
    hasSecondStep &&
    hasThirdStep &&
    !isNull(character.perks);

  if (hasFourthStep) {
    if (step !== 4) { goToLink(router, 'sheet/creation/end', character); } else { return character; }
  } else if (hasThirdStep) {
    if (step !== 3) { goToLink(router, 'sheet/creation/perks', character); } else { return character; }
  } else if (hasSecondStep) {
    if (step !== 2) { goToLink(router, 'sheet/creation/abilities', character); } else { return character; }
  } else if (hasFirstStep) {
    if (step !== 1) { goToLink(router, 'sheet/creation/attributes', character); } else { return character; }
  } else if (step !== 0) {
    returnToStart(router);
  } else {
    return character;
  }
}
