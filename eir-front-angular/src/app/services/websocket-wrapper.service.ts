import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationService} from './authentication.service';

declare var EventBus: any;

@Injectable()
export class WebsocketWrapperService {
  constructor(
    private httpWrapperService: HttpWrapperService,
    private authenticationService: AuthenticationService
  ) { }

  createWebSocket(roomId: string, delegate: (error: any, message: any) => void): any {
    const auth = this.authenticationService.retrieveStoredSession();
    const tokens = {
      'x-session-header': auth.headerToken,
      'x-session-cookie': auth.cookieToken,
      room: '1'
    };

    const eventBus = new EventBus(`${this.httpWrapperService.baseUrl}/Chat/${roomId}`, tokens);
    eventBus.onopen = () => {
      eventBus.registerHandler('out', tokens, delegate);
    };

    return eventBus;
  }
}
