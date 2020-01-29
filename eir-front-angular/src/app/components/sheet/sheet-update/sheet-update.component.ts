import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterService} from '../../../services/character.service';
import {Character, getCharacterVisualName} from '../../../services/dtos/character';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

@Component({
  selector: 'app-sheet-update',
  templateUrl: './sheet-update.component.html',
  styleUrls: ['./sheet-update.component.css']
})
export class SheetUpdateComponent implements OnInit {
  private characterId: number;
  private ch: Character;

  get character(): Character {
    return this.ch;
  }

  set character(c: Character) {
    this.ch = c;
  }

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .flatMap(p => {
        this.characterId = Number(p.get('id'));
        return this.characterService.getCharacterById(this.characterId);
      })
      .subscribe(x => this.errorHandler.handleError(x, c => this.ch = c));
  }

  save() {
    this.characterService.updateCharacter({
      id: this.ch.id,
      fullName: this.ch.fullName,
      photoUrl: this.ch.photoUrl,
      description: this.ch.description,
      background: this.ch.background
    })
      .subscribe(_ => this.router.navigate(['sheet', this.characterId]));
  }
}
