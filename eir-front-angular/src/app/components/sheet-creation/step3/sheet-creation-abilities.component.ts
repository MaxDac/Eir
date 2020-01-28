import { Component, OnInit } from '@angular/core';
import {Characteristic, MartialAttribute, MentalAttribute} from '../../../services/dtos/characteristic';
import {Character} from '../../../services/dtos/character';
import {HelpService} from '../../../services/help.service';
import {ActivatedRoute, Router} from '@angular/router';
import {tryGetState} from '../../../base/route-utils';
import {checkCharacterState, divideCharacteristics, mapCharacteristicForSave, setCharacterState} from '../sheet-creation-helpers';
import {CookieService} from 'ngx-cookie-service';
import {StorageService} from '../../../services/storage-service';

@Component({
  selector: 'app-sheet-creation-abilities',
  templateUrl: './sheet-creation-abilities.component.html',
  styleUrls: ['./sheet-creation-abilities.component.css']
})
export class SheetCreationAbilitiesComponent implements OnInit {
  characteristics: Characteristic[];

  private character: Character;
  private stepCompleted = false;

  get maxMartials(): number {
    if (this.character === undefined || this.character.type === undefined) {
      return 0;
    } else {
      return this.character.type.maxMartialAttributes;
    }
  }

  get maxMentals(): number {
    if (this.character === undefined || this.character.type === undefined) {
      return 0;
    } else {
      return this.character.type.maxMentalAttributes + 4;
    }
  }

  constructor(
    private client: HelpService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.character = checkCharacterState(this.storageService, this.router, 2);

    this.client.getAbilities()
      .subscribe(x => {
        this.characteristics = divideCharacteristics(x);
      });
  }

  proceed() {
    if (this.stepCompleted) {
      this.character.martialAbilities = this.characteristics
        .filter(x => x.type === MartialAttribute)
        .map(mapCharacteristicForSave);

      this.character.mentalAbilities = this.characteristics
        .filter(x => x.type === MentalAttribute)
        .map(mapCharacteristicForSave);

      setCharacterState(this.storageService, this.character);
      this.router.navigate(['sheet/creation/perks'], {
        state: this.character
      });
    }
  }

  respondIsCompleted(isCompleted: boolean) {
    this.stepCompleted = isCompleted;
  }

  goBack() {
    this.character.martialAttributes = null;
    this.character.mentalAttributes = null;
    setCharacterState(this.storageService, this.character);
    this.router.navigate(['sheet/creation/attributes'], {
      state: this.character
    });
  }
}
