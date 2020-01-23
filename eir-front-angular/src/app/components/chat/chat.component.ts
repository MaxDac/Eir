import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {ChatInputModel} from './chat-input/chat-input.component';
import {ChatEntry} from '../../services/dtos/chat-entry';

declare var EventBus: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private roomId: string;
  private eventBus: any;
  currentValue: ChatEntry[];

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  private registerHandler(roomId: string) {
    const auth = this.authenticationService.retrieveStoredSession();
    const tokens = {
      'x-session-header': auth.headerToken,
      'x-session-cookie': auth.cookieToken,
      room: '1'
    };

    this.eventBus = new EventBus(`http://localhost:8080/Api/Chat/${roomId}`, tokens);
    this.eventBus.onopen = () => {
      this.eventBus.registerHandler('out', tokens, (error, message) => {
        if (error !== undefined && error !== null) {
          console.error(`Error! ${JSON.stringify(error)}`);
        } else {
          this.currentValue = JSON.parse(message.body);
        }
      });
    };
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(p => {
        this.roomId = p.get('id');
        this.registerHandler(this.roomId);
      });
  }

  onSendPhrase(phrase: ChatInputModel) {
    const request = {
      roomId: this.roomId,
      characterId: phrase.characterId,
      action: phrase.phrase
    };

    console.log(`Sending ${JSON.stringify(request)}`);

    this.eventBus.send('in', request);
  }
}
