import { Component, OnInit } from '@angular/core';
import {Character} from '../../services/dtos/character';
import {CharacterService} from '../../services/character.service';
import {AuthenticationService} from '../../services/authentication.service';
import {isNull} from '../../helpers';

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
  selectedCharacter: Character;

  get isSessionUserNull(): boolean {
    return isNull(this.userId);
  }

  get showSelector(): boolean {
    return !this.isSessionUserNull && this.componentState === CharacterSelectorComponentState.SELECT;
  }

  get showActivator(): boolean {
    if (this.isSessionUserNull) {
      console.log('session user is null!');
    } else {
      console.log('session user is not null!');
    }
    return !this.isSessionUserNull && this.componentState === CharacterSelectorComponentState.NORMAL;
  }

  get userId(): number | null {
    const session = this.authenticationService.retrieveStoredSession();
    if (isNull(session)) { return null; } else { return session.userId; }
  }

  get characters(): Character[] {
    console.log(`characters: ${JSON.stringify(this.chs)}`);
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
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const uid = this.userId;

    if (!isNull(uid)) {
      this.provider.getCharacterByUserId(uid)
        .subscribe(cs => this.chs = cs);
    }
  }

  changeCharacter() {
    this.authenticationService.changeCharacter(this.selectedCharacter.id, this.selectedCharacter.name);
    this.componentState = CharacterSelectorComponentState.NORMAL;
  }

  changeState() {
    if (this.componentState === CharacterSelectorComponentState.NORMAL) {
      this.componentState = CharacterSelectorComponentState.SELECT;
    } else {
      this.componentState = CharacterSelectorComponentState.NORMAL;
    }
  }
}
