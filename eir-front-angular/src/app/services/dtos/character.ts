import {Characteristic} from './characteristic';
import {Perk} from './perk';
import {CharacterType} from './character-type';
import {Race} from './race';
import {isNull} from '../../helpers';

function prepareCharacteristicForSave(characteristic: Characteristic): any {
  return {
    id: characteristic.id,
    name: characteristic.name,
    value: characteristic.value
  };
}

function preparePerkForSave(perk: Perk): any {
  return {
    id: perk.id,
    name: perk.name,
    affectedCharacteristic: perk.affectedCharacteristic.map(a => {
      return {
        id: '',
        characteristicId: a.characteristic.id,
        characteristicName: a.characteristic.name,
        characteristicValue: a.value
      };
    })
  };
}

export function prepareForSave(character: Character): any {
  return {
    id: character.id,
    name: character.name,
    type: {
      id: character.type.id,
      name: character.type.name
    },
    fatherRace: {
      id: character.fatherRace.id,
      name: character.fatherRace.name
    },
    motherRace: {
      id: character.motherRace.id,
      name: character.motherRace.name
    },
    hasModifiers: character.hasModifiers,
    martialAttributes: character.martialAttributes.map(prepareCharacteristicForSave),
    mentalAttributes: character.mentalAttributes.map(prepareCharacteristicForSave),
    martialAbilities: character.martialAbilities.map(prepareCharacteristicForSave),
    mentalAbilities: character.mentalAbilities.map(prepareCharacteristicForSave),
    perks: character.perks.map(preparePerkForSave)
  };
}

export interface Character {
  id: number | null;
  name: string | null;
  fullName?: string | null;
  type: CharacterType;
  fatherRace: Race;
  motherRace: Race;
  hasModifiers: boolean;
  photoUrl?: string;
  description?: string;
  background?: string;
  experience?: number;
  experienceSpent?: number;
  martialAttributes: Characteristic[] | null;
  mentalAttributes: Characteristic[] | null;
  martialAbilities: Characteristic[] | null;
  mentalAbilities: Characteristic[] | null;
  perks: Perk[] | null;
}

export function getCharacterVisualName(c: Character) {
  return isNull(c.fullName) ? c.name : c.fullName;
}
