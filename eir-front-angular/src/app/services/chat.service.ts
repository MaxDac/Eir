import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Room} from './dtos/room';
import {Observable} from 'rxjs';
import {ChatEntry} from './dtos/chat-entry';
import {AuthenticationService} from './authentication.service';
import {SessionTokens} from './dtos/session-tokens';
import {ApiException} from './dtos/api-exception';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(
    private provider: HttpWrapperService,
    private authenticationService: AuthenticationService
  ) { }

  getRooms(): Observable<Room[] | ApiException> {
    return this.provider.get('/Rooms', this.authenticationService.retrieveStoredSession());
  }

  getChatEntryByRoomId(roomId: string): Observable<ChatEntry[] | ApiException> {
    return this.provider.get(`/Room/${roomId}/Entries`, this.authenticationService.retrieveStoredSession());
  }
}
