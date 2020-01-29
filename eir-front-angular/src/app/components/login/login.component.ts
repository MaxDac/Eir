import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageErrorHandlerService} from '../../services/page-error-handler.service';
import {tryGetState} from '../../base/route-utils';
import {ApiException, isError} from '../../services/dtos/api-exception';
import {MatSnackBar} from '@angular/material';
import {isNull} from '../sheet-creation/sheet-creation-helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private errorHandler: PageErrorHandlerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    tryGetState<ApiException>(this.route)
      .subscribe(x => {
        console.error(`Is error?: ${JSON.stringify(x)}`);
        if (isError(x)) {
          this.snackBar.open(`Errore nella chiamata al servizio: ${x.details}`, 'Chiudi', {
            duration: 4000
          });
        }
      });
  }

  authenticate() {
    this.authenticationService.login({
      username: this.username,
      password: this.password
    }).subscribe(x => this.errorHandler.handleError(x, result => {
      if (result.userId !== null) {
        this.router.navigate(['']);
      } else {
        console.log(`Failed!`);
      }
    }));
  }

}
