import { Component, OnInit } from '@angular/core';
import {Character, prepareForSave} from '../../../services/dtos/character';
import {checkCharacterState, setCharacterState} from '../sheet-creation-helpers';
import {CookieService} from 'ngx-cookie-service';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterService} from '../../../services/character.service';
import {Characteristic} from '../../../services/dtos/characteristic';

@Component({
  selector: 'app-sheet-creation-end',
  templateUrl: './sheet-creation-end.component.html',
  styleUrls: ['./sheet-creation-end.component.css']
})
export class SheetCreationEndComponent implements OnInit {
  character: Character;
  get characterAttributes(): Characteristic[] { return this.character.martialAttributes.concat(this.character.mentalAttributes); }
  get characterAbilities(): Characteristic[] { return this.character.martialAbilities.concat(this.character.mentalAbilities); }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private client: CharacterService
  ) { }

  ngOnInit() {
    this.character = checkCharacterState(this.cookieService, this.router, 4);
  }

  proceed() {
    this.client.saveCharacter(prepareForSave(this.character))
      .subscribe(x => {
        console.log(x);
        this.router.navigate(['']);
      });
  }

  goBack() {
    this.character.perks = null;
    setCharacterState(this.cookieService, this.character);
    this.router.navigate(['sheet/creation/perks'], {
      state: this.character
    });
  }
}
