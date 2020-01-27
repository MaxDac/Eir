import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {tryGetState} from '../../../base/route-utils';
import {HelpService} from '../../../services/help.service';
import {Characteristic, MartialAttribute, MentalAttribute} from '../../../services/dtos/characteristic';
import {Character} from '../../../services/dtos/character';
import {
  checkCharacterState,
  divideCharacteristics,
  mapCharacteristicForSave,
  resetCache,
  setCharacterState
} from '../sheet-creation-helpers';
import {CookieService} from 'ngx-cookie-service';
import {StorageService} from '../../../services/storage-service';

@Component({
  selector: 'app-sheet-creation-attributes',
  templateUrl: './sheet-creation-attributes.component.html',
  styleUrls: ['./sheet-creation-attributes.component.css']
})
export class SheetCreationAttributesComponent implements OnInit {
  characteristics: Characteristic[];

  private character: Character;
  private stepCompleted = false;

  get maxMartials(): number {
    if (this.character === undefined || this.character.type === undefined) {
      return 0;
    } else {
      return this.character.type.maxMartialAttributes + 4;
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
    this.character = checkCharacterState(this.storageService, this.router, 1);

    this.client.getCharacteristics()
      .subscribe(x => {
        this.characteristics = divideCharacteristics(x);
      });
  }

  proceed() {
    if (this.stepCompleted) {
      this.character.martialAttributes = this.characteristics
        .filter(x => x.value !== 0 && x.type === MartialAttribute)
        .map(mapCharacteristicForSave);

      this.character.mentalAttributes = this.characteristics
        .filter(x => x.value !== 0 && x.type === MentalAttribute)
        .map(mapCharacteristicForSave);

      setCharacterState(this.storageService, this.character);
      this.router.navigate(['sheet/creation/abilities'], {
        state: this.character
      });
    }
  }

  respondIsCompleted(isCompleted: boolean) {
    this.stepCompleted = isCompleted;
  }

  goBack() {
    resetCache(this.storageService);
    this.router.navigate(['sheet/creation']);
  }
}
