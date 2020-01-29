import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {CharacterService} from '../../../services/character.service';
import {Router} from '@angular/router';
import {Room} from '../../../services/dtos/room';
import {ChatService} from '../../../services/chat.service';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.css']
})
export class ChatRoomsComponent implements OnInit {
  rooms: Room[];
  selectedRoom: number;

  constructor(
    private authenticationService: AuthenticationService,
    private service: ChatService,
    private router: Router,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.service.getRooms()
      .subscribe(x => this.errorHandler.handleError(x, cs => this.rooms = cs));
  }

  select() {
    this.router.navigate(['chat', this.selectedRoom]);
  }
}
