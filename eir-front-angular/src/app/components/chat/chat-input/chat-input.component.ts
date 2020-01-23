import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {CharacterService} from '../../../services/character.service';
import {Character} from '../../../services/dtos/character';

export interface ChatInputModel {
  phrase: string;
  characterId: number;
}

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {
  phrase: string;
  characters: Character[];
  selectedCharacterId: number;

  @Output()
  sendingPhrase = new EventEmitter<ChatInputModel>();

  constructor(
    private provider: CharacterService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const userId = this.authenticationService.retrieveStoredSession().userId;

    this.provider.getCharacterByUserId(userId)
      .subscribe(cs => this.characters = cs);
  }

  send(_: MouseEvent) {
    this.sendingPhrase.emit({
      phrase: this.phrase,
      characterId: this.selectedCharacterId
    });
  }
}
