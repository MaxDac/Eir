import { Component, OnInit } from '@angular/core';
import {CharacterService} from '../../services/character.service';
import {ActivatedRoute} from '@angular/router';
import {Character, getCharacterVisualName} from '../../services/dtos/character';
import {getCompleteRace} from '../sheet-creation/sheet-creation-helpers';
import {PageErrorHandlerService} from '../../services/page-error-handler.service';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  character: Character;

  get fullName(): string {
    return getCharacterVisualName(this.character);
  }

  get completeRace(): string {
    return getCompleteRace(this.character.fatherRace, this.character.motherRace, this.character.hasModifiers);
  }

  constructor(
    private service: CharacterService,
    private route: ActivatedRoute,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .map(x => x.get('id'))
      .flatMap(id => this.service.getCharacterById(Number(id)))
      .subscribe(y => this.errorHandler.handleError(y, x => {
        this.character = x;
      }));
  }

}
