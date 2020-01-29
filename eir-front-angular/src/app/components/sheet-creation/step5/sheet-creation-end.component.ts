import { Component, OnInit } from '@angular/core';
import {Character, prepareForSave} from '../../../services/dtos/character';
import {checkCharacterState, getCompleteRace, setCharacterState} from '../sheet-creation-helpers';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterService} from '../../../services/character.service';
import {Characteristic} from '../../../services/dtos/characteristic';
import {StorageService} from '../../../services/storage.service';

@Component({
  selector: 'app-sheet-creation-end',
  templateUrl: './sheet-creation-end.component.html',
  styleUrls: ['./sheet-creation-end.component.css']
})
export class SheetCreationEndComponent implements OnInit {
  character: Character;
  get characterAttributes(): Characteristic[] { return this.character.martialAttributes.concat(this.character.mentalAttributes); }
  get characterAbilities(): Characteristic[] { return this.character.martialAbilities.concat(this.character.mentalAbilities); }

  get completeRace(): string {
    return getCompleteRace(this.character.fatherRace, this.character.motherRace, this.character.hasModifiers);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private client: CharacterService
  ) { }

  ngOnInit() {
    this.character = checkCharacterState(this.storageService, this.router, 4);
  }

  proceed() {
    const request = prepareForSave(this.character);
    this.client.saveCharacter(request)
      .subscribe(x => {
        this.router.navigate(['']);
      });
  }

  goBack() {
    this.character.perks = null;
    setCharacterState(this.storageService, this.character);
    this.router.navigate(['sheet/creation/perks'], {
      state: this.character
    });
  }
}
