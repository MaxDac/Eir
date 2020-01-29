import { Component, OnInit } from '@angular/core';
import {Character} from '../../../services/dtos/character';
import {CharacterService} from '../../../services/character.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

@Component({
  selector: 'app-sheet-selection',
  templateUrl: './sheet-selection.component.html',
  styleUrls: ['./sheet-selection.component.css']
})
export class SheetSelectionComponent implements OnInit {
  characters: Character[];
  selectedCharacter: number;

  constructor(
    private authenticationService: AuthenticationService,
    private service: CharacterService,
    private router: Router,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    const session = this.authenticationService.retrieveStoredSession();
    this.service.getCharacterByUserId(session.userId)
      .subscribe(x => this.errorHandler.handleError(x, cs => this.characters = cs));
  }

  select() {
    this.router.navigate(['sheet', this.selectedCharacter]);
  }

  createNew() {
    this.router.navigate(['sheet/creation']);
  }
}
