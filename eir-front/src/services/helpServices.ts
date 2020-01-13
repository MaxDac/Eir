import {DataGetter} from "../base/data-getter";
import Characteristic from "../dtos/characteristic";

export class HelpServices {
    constructor(private origin: DataGetter) {}

    getCharacteristics(): Promise<Characteristic[]> {
        return this.origin.get('/Characteristics');
    }

    getAbilities(): Promise<Characteristic[]> {
        return this.origin.get('/Abilities');
    }
}
