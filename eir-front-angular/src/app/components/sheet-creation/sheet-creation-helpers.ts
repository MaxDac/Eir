import {Characteristic, MartialAttribute, MentalAttribute} from '../../services/dtos/characteristic';
import {Router} from '@angular/router';
import {Character} from '../../services/dtos/character';
import {Race} from '../../services/dtos/race';
import {StorageService} from '../../services/storage.service';

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
    console.error(`Attenzione!: ${e}`);
    return null;
  }
}

export function isNull(s: any): boolean {
  return s === undefined || s === null;
}

export function isNullOrEmpty(s: string): boolean {
  return isNull(s) || s === '';
}

export function resetCache(service: StorageService) {
  service.delete(CHARACTER_COOKIE_KEY);
}

export function setCharacterState(service: StorageService, character: Character) {
  service.store(CHARACTER_COOKIE_KEY, JSON.stringify(character));
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

export function checkCharacterState(service: StorageService, router: Router, step: number): Character | null {
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

  const serializedCharacter = service.getString(CHARACTER_COOKIE_KEY);

  console.info(`serialized character: ${serializedCharacter}`);

  if (isNullOrEmpty(serializedCharacter)) {
    console.error('Character null');
    returnToStart(router);
    return null;
  }

  const character = tryParse<Character>(serializedCharacter);
  if (character === null) {
    console.error('Failed to deserialize character');
    returnToStart(router);
    return null;
  }

  console.info(`p: ${character[0]}`);
  console.info(`name: ${character.name}`);
  console.info(`type: ${JSON.stringify(character.type)}`);
  console.info(`fatherRace: ${JSON.stringify(character.fatherRace)}`);
  console.info(`motherRace: ${JSON.stringify(character.motherRace)}`);

  const hasFirstStep = !isNullOrEmpty(character.name) &&
    !isNull(character.type) &&
    !isNull(character.fatherRace) &&
    !isNull(character.motherRace);

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
    console.info('hasFourthStep');
    if (step !== 4) { goToLink(router, 'sheet/creation/end', character); } else { return character; }
  } else if (hasThirdStep) {
    console.info('hasThirdStep');
    if (step !== 3) { goToLink(router, 'sheet/creation/perks', character); } else { return character; }
  } else if (hasSecondStep) {
    if (step !== 2) { goToLink(router, 'sheet/creation/abilities', character); } else { return character; }
  } else if (hasFirstStep) {
    console.info('hasFirstStep');
    if (step !== 1) { goToLink(router, 'sheet/creation/attributes', character); } else { return character; }
  } else if (step !== 0) {
    returnToStart(router);
  } else {
    return character;
  }
}

export function getCompleteRace(selectedFatherRace: Race, selectedMotherRace: Race, hasModifiers: boolean): string {
  if (isNull(selectedFatherRace) || isNull(selectedMotherRace)) {
    return '';
  } else if (selectedFatherRace.id === selectedMotherRace.id) {
    return selectedFatherRace.name;
  } else if (!hasModifiers) {
    return 'Mezzosangue';
  } else {
    return `${selectedFatherRace.name}/${selectedMotherRace.name}`;
  }
}
