import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {ChatEntry} from '../../services/dtos/chat-entry';
import {environment} from '../../../environments/environment';
import {HttpWrapperService} from '../../services/http-wrapper.service';
import {WebsocketWrapperService} from '../../services/websocket-wrapper.service';
import {DiceThrow} from './chat-input/chat-input.component';

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
    private socketService: WebsocketWrapperService,
    private route: ActivatedRoute
  ) { }

  private registerHandler(roomId: string) {
    this.eventBus = this.socketService.createWebSocket(this.roomId, (error, message) => {
      if (error !== undefined && error !== null) {
        console.error(`Error! ${JSON.stringify(error)}`);
      } else {
        let remoteValue: ChatEntry[] = JSON.parse(message.body);
        remoteValue = remoteValue.sort((x1, x2) => {
          if (x1.creationDate > x2.creationDate) {
            return -1;
          } else {
            return 1;
          }
        });
        this.currentValue = remoteValue;
      }
    });
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(p => {
        this.roomId = p.get('id');
        this.registerHandler(this.roomId);
      });
  }

  private sendWebSocketRequest(request: any) {
    this.eventBus.send('in', request);
  }

  onSendPhrase(phrase: string) {
    const characterId = this.authenticationService.retrieveStoredSession().characterId;

    const request = {
      roomId: this.roomId,
      characterId,
      action: phrase
    };

    console.log(`Sending ${JSON.stringify(request)}`);
    this.sendWebSocketRequest(request);
  }

  onSendDices(dices: DiceThrow) {
    console.log(`receiving request: ${JSON.stringify(dices)}`);
    const characterId = this.authenticationService.retrieveStoredSession().characterId;

    const request = {
      roomId: this.roomId,
      characterId,
      action: '',
      attributeId: dices.attributeId,
      abilityId: dices.abilityId,
      cd: dices.cd
    };

    console.log(`Sending ${JSON.stringify(request)}`);
    this.sendWebSocketRequest(request);
  }
}
