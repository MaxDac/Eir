import {Component, Input, OnInit} from '@angular/core';
import {ChatEntry} from '../../../services/dtos/chat-entry';

@Component({
  selector: 'app-chat-rows',
  templateUrl: './chat-rows.component.html',
  styleUrls: ['./chat-rows.component.css']
})
export class ChatRowsComponent implements OnInit {
  private chatRows: ChatEntry[];

  @Input()
  set rows(value: ChatEntry[]) {
    this.chatRows = value;
  }

  get rows(): ChatEntry[] {
    return this.chatRows;
  }

  constructor() { }

  ngOnInit() {
  }

}
