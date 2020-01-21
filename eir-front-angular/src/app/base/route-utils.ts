import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

export function tryGetState<T>(route: ActivatedRoute): Observable<T | null> {
  return route.paramMap.map(_ => {
    const state = window.history.state;

    if ((state as T) !== undefined) {
      return state as T;
    } else {
      return null;
    }
    // try {
    //   return state as T;
    // } catch (e) {
    //   return null;
    // }
  });
}
