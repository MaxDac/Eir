import { Component, OnInit } from '@angular/core';
import {Character} from '../../services/dtos/character';
import {CharacterService} from '../../services/character.service';
import {AuthenticationService} from '../../services/authentication.service';
import {isNull} from '../../helpers';
import {MatSnackBar} from '@angular/material';
import {isError} from '../../services/dtos/api-exception';
import {PageErrorHandlerService} from '../../services/page-error-handler.service';

enum CharacterSelectorComponentState {
  NORMAL,
  SELECT
}

@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.css']
})
export class CharacterSelectorComponent implements OnInit {
  private chs: Character[];
  private componentState: CharacterSelectorComponentState = CharacterSelectorComponentState.NORMAL;
  private storedUserId: number;
  selectedCharacter: Character;

  get isSessionUserNull(): boolean {
    return isNull(this.userId);
  }

  get showSelector(): boolean {
    return !this.isSessionUserNull && this.componentState === CharacterSelectorComponentState.SELECT;
  }

  get showActivator(): boolean {
    return !this.isSessionUserNull && this.componentState === CharacterSelectorComponentState.NORMAL;
  }

  get userId(): number | null {
    const session = this.authenticationService.retrieveStoredSession();
    if (isNull(session)) {
      return null;
    } else {
      if (this.storedUserId !== session.userId) {
        this.storedUserId = session.userId;
        this.getCharacters();
      }

      return this.storedUserId;
    }
  }

  get characters(): Character[] {
    return this.chs;
  }

  get sessionCharacterName(): string | null {
    const session = this.authenticationService.retrieveStoredSession();
    if (!isNull(session)) {
      return session.characterName;
    } else {
      return null;
    }
  }

  constructor(
    private provider: CharacterService,
    private authenticationService: AuthenticationService,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.getCharacters();
  }

  private changeSessionCharacterIfNull(cs: Character[]) {
    const session = this.authenticationService.retrieveStoredSession();
    if (!isNull(session) && isNull(session.characterId)) {
      this.selectedCharacter = cs[0];
      this.changeCharacter();
    }
  }

  private getCharacters() {
    const uid = this.userId;

    if (!isNull(uid)) {
      this.provider.getCharacterByUserId(uid)
        .subscribe(x => this.errorHandler.handleError(x, cs => {
          this.chs = cs;

          if (!isNull(this.chs) && this.chs.length !== 0) {
            this.changeSessionCharacterIfNull(this.chs);
          }
        }));
    }
  }

  changeCharacter() {
    this.authenticationService.changeCharacter(this.selectedCharacter.id, this.selectedCharacter.name);
    this.componentState = CharacterSelectorComponentState.NORMAL;
  }

  changeComponentState() {
    if (this.componentState === CharacterSelectorComponentState.NORMAL) {
      this.componentState = CharacterSelectorComponentState.SELECT;
    } else {
      this.componentState = CharacterSelectorComponentState.NORMAL;
    }
  }
}
