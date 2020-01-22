import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanActivateViaAuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    const session = this.authenticationService.retrieveStoredSession();

    if (session === null) {
      console.log('No session!');
      this.router.navigate(['login']);
      return false;
    }

    console.log('Session ok!');
    return true;
  }

}
