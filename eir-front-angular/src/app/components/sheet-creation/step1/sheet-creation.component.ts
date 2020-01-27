import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HelpService} from '../../../services/help.service';
import {Race} from '../../../services/dtos/race';
import {CharacterType} from '../../../services/dtos/character-type';
import {checkCharacterState, getCompleteRace, setCharacterState} from '../sheet-creation-helpers';
import {Character} from '../../../services/dtos/character';
import {isNull} from '../../../helpers';
import {StorageService} from '../../../services/storage-service';

@Component({
  selector: 'app-sheet-creation',
  templateUrl: './sheet-creation.component.html',
  styleUrls: ['./sheet-creation.component.css']
})
export class SheetCreationComponent implements OnInit {

  races: Race[];
  characteristicTypes: CharacterType[];

  selectedFatherRace: Race;
  selectedMotherRace: Race;
  hasModifiers: boolean;
  selectedType: CharacterType;
  name: string;

  get showModifiersSelector(): boolean {
    return !isNull(this.selectedFatherRace) &&
      !isNull(this.selectedMotherRace) &&
      this.selectedFatherRace.id !== this.selectedMotherRace.id;
  }

  get completeRace(): string {
    return getCompleteRace(this.selectedFatherRace, this.selectedMotherRace, this.hasModifiers);
  }

  constructor(
    private client: HelpService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    checkCharacterState(this.storageService, this.router, 0);

    this.client.getRaces()
      .subscribe(rcs => this.races = rcs);

    this.client.getCharacteristicTypes()
      .subscribe(t => this.characteristicTypes = t);
  }

  proceed() {
    const character: Character = {
      id: null,
      name: this.name,
      type: this.selectedType,
      fatherRace: this.selectedFatherRace,
      motherRace: this.selectedMotherRace,
      hasModifiers: this.hasModifiers,
      martialAttributes: null,
      mentalAttributes: null,
      martialAbilities: null,
      mentalAbilities: null,
      perks: null
    };
    setCharacterState(this.storageService, character);
    this.router.navigate(['sheet/creation/attributes'], {
      state: character
    });
  }
}
