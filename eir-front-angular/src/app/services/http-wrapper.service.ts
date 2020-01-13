import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import 'rxjs-compat/add/operator/map';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class HttpWrapperService {

  constructor(public http: HttpClient) {}

  private baseUrl = 'http://localhost:8080';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private static errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }

  private buildUrl(relativeUrl: string): string {
    const isComplete = relativeUrl.substr(0, 1) === '/';
    return `${this.baseUrl}${isComplete ? '' : '/'}${relativeUrl}`;
  }

  get<T>(url: string): Observable<T> {
    const completeUrl = this.buildUrl(url);
    console.log(`calling: ${completeUrl}`);
    return this.http.get(completeUrl)
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => x as T);
  }

  post<T>(url: string, body: any | null): Observable<T> {
    return this.http.post(this.buildUrl(url), body, this.httpOptions)
      .pipe(catchError(HttpWrapperService.errorHandler))
      .map(x => x as T);
  }
}
