import {Characteristic} from './characteristic';

export interface PerkCharacteristic {
  characteristic: Characteristic;
  value: number;
}

export interface Perk {
  id: number;
  name: string;
  description: string;
  negative: boolean;
  affectedCharacteristic: PerkCharacteristic[];
}
