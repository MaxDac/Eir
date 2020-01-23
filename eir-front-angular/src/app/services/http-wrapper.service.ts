import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import 'rxjs-compat/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {SessionTokens} from './dtos/session-tokens';
import {isNull} from '../helpers';

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

  constructor(public http: HttpClient) {}

  private baseUrl = 'http://localhost:8080/Api';

  private readonly httpOptions: AppHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  private static errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
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

  get<T>(url: string, authentication?: SessionTokens | null): Observable<T> {

    const completeUrl = this.buildUrl(url);
    console.log(`calling: ${completeUrl}`);

    const observable = isNull(authentication) ?
      this.http.get(completeUrl) :
      this.http.get(completeUrl, this.authenticationOptions(authentication));

    return observable
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => x as T);
  }

  post<T>(url: string, body: any | null, authentication?: SessionTokens | null): Observable<T> {
    console.log(`Session: ${JSON.stringify(authentication)}`);
    const options = isNull(authentication) ?
      this.httpOptions :
      this.addAuthentication(this.httpOptions, authentication);

    return this.http.post(this.buildUrl(url), body, options)
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => x as T);
  }
}
