import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNull} from '../../../helpers';
import {MatBottomSheet} from '@angular/material';
import {ChatInputDicesComponent} from '../chat-input-dices/chat-input-dices.component';

export interface DiceThrow {
  attributeId: number;
  abilityId: number;
  cd?: number;
  opponentId?: number;
  opponentAttributeId?: number;
  opponentAbilityId?: number;
}

export interface DiceCallback {
  self: ChatInputComponent;
  roomId: number;
  callback: (ChatInputComponent, DiceThrow) => void;
}

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {
  phrase: string;

  get phraseLength(): number {
    if (isNull(this.phrase)) {
      return 0;
    } else {
      return this.phrase.length;
    }
  }

  @Input()
  roomId: number;

  @Output()
  sendingPhrase = new EventEmitter<string>();

  @Output()
  sendingDices = new EventEmitter<DiceThrow>();

  constructor(private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  send(_: MouseEvent) {
    const p = this.phrase;
    this.sendingPhrase.emit(p);
    this.phrase = '';
  }

  windowCallback(self: ChatInputComponent, response: DiceThrow) {
    self.sendingDices.emit(response);
  }

  selectDices() {
    this.bottomSheet.open(ChatInputDicesComponent, {
      data: {
        self: this,
        roomId: this.roomId,
        callback: this.windowCallback
      }
    });
  }
}
