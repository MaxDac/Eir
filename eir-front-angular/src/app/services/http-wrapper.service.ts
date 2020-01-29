import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import 'rxjs-compat/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {SessionTokens} from './dtos/session-tokens';
import {isNull} from '../helpers';
import {environment} from '../../environments/environment';
import {ApiException, isError, SESSION_NOT_FOUND_CODE} from './dtos/api-exception';
import {LogoutService} from './logout-service';

interface AppHttpOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpWrapperService {
  constructor(
    public http: HttpClient,
    private logoutService: LogoutService
  ) {}

  baseUrl = `${this.hostFromConfiguration()}${environment.baseUrl}`;

  private readonly httpOptions: AppHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  private static errorHandler(error: HttpErrorResponse) {
    console.error(`Error from the back end!: ${JSON.stringify(error)}`);
    return throwError(error.message);
  }

  private hostFromConfiguration() {
    const parts = window.location.href.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  private authenticationOptions(tokens: SessionTokens): AppHttpOptions {
    return {
      headers: new HttpHeaders({
        'x-session-header': tokens.headerToken
      }),
      withCredentials: true
    };
  }

  private addAuthentication(options: AppHttpOptions, tokens: SessionTokens): AppHttpOptions {
    return {
      headers: options.headers !== null ?
        options.headers.append('x-session-header', tokens.headerToken) :
        new HttpHeaders({
          'x-session-header': tokens.headerToken
        }),
      withCredentials: true
    };
  }

  private buildUrl(relativeUrl: string): string {
    const isComplete = relativeUrl.substr(0, 1) === '/';
    return `${this.baseUrl}${isComplete ? '' : '/'}${relativeUrl}`;
  }

  manageRemoteResult<T>(apiResponse: any): T | ApiException {
    if (isError(apiResponse)) {
      const error: ApiException = apiResponse as ApiException;
      if (error.apiErrorCode === SESSION_NOT_FOUND_CODE) {
        this.logoutService.logout();
      }

      return null;
    }

    return apiResponse as T;
  }

  get<T>(url: string, authentication?: SessionTokens | null): Observable<T | ApiException> {

    const completeUrl = this.buildUrl(url);
    console.log(`calling (GET): ${completeUrl}`);

    const observable = isNull(authentication) ?
      this.http.get(completeUrl) :
      this.http.get(completeUrl, this.authenticationOptions(authentication));

    return observable
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => this.manageRemoteResult(x));
  }

  post<T>(url: string, body: any | null, authentication?: SessionTokens | null): Observable<T | ApiException> {
    // console.log(`Session: ${JSON.stringify(authentication)}`);
    const options = isNull(authentication) ?
      this.httpOptions :
      this.addAuthentication(this.httpOptions, authentication);

    const completeUrl = this.buildUrl(url);
    console.log(`calling (POST): ${completeUrl}`);

    return this.http.post(completeUrl, body, options)
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => this.manageRemoteResult(x));
  }
}
