import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HelpService} from '../../../services/help.service';
import {Race} from '../../../services/dtos/race';
import {CharacterType} from '../../../services/dtos/character-type';
import {CHARACTER_COOKIE_KEY, checkCharacterState, setCharacterState} from '../sheet-creation-helpers';
import {CookieService} from 'ngx-cookie-service';
import {Character} from '../../../services/dtos/character';

@Component({
  selector: 'app-sheet-creation',
  templateUrl: './sheet-creation.component.html',
  styleUrls: ['./sheet-creation.component.css']
})
export class SheetCreationComponent implements OnInit {

  races: Race[];
  characteristicTypes: CharacterType[];

  selectedRace: Race;
  selectedType: CharacterType;
  name: string;

  constructor(
    private client: HelpService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    checkCharacterState(this.cookieService, this.router, 0);

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
      race: this.selectedRace,
      martialAttributes: null,
      mentalAttributes: null,
      martialAbilities: null,
      mentalAbilities: null,
      perks: null
    };
    setCharacterState(this.cookieService, character);
    this.router.navigate(['sheet/creation/attributes'], {
      state: character
    });
  }
}
