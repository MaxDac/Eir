import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Room} from './dtos/room';
import {Observable} from 'rxjs';
import {ChatEntry} from './dtos/chat-entry';
import {AuthenticationService} from './authentication.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(
    private provider: HttpWrapperService,
    private authenticationService: AuthenticationService
  ) { }

  getRooms(): Observable<Room[]> {
    return this.provider.get('/Rooms', this.authenticationService.retrieveStoredSession());
  }

  getChatEntryByRoomId(roomId: string): Observable<ChatEntry[]> {
    return this.provider.get(`/Room/${roomId}/Entries`, this.authenticationService.retrieveStoredSession());
  }
}
