import {Characteristic} from './characteristic';
import {Perk} from './perk';
import {CharacterType} from './character-type';
import {Race} from './race';

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
    race: {
      id: character.race.id,
      name: character.race.name
    },
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
  type: CharacterType;
  race: Race;
  martialAttributes: Characteristic[] | null;
  mentalAttributes: Characteristic[] | null;
  martialAbilities: Characteristic[] | null;
  mentalAbilities: Characteristic[] | null;
  perks: Perk[] | null;
}
