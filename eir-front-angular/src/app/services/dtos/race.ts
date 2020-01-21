import {Characteristic} from './characteristic';

export interface Race {
  id: number;
  name: string;
  description: string | null;
  maxAttribute: Characteristic | null;
  minAttribute: Characteristic | null;
}
