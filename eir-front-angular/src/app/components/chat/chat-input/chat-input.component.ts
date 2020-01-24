import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {isNull} from '../../../helpers';

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

  @Output()
  sendingPhrase = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  send(_: MouseEvent) {
    const p = this.phrase;
    this.sendingPhrase.emit(p);
    this.phrase = '';
  }
}
