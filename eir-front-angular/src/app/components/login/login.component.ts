import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  authenticate() {
    this.authenticationService.login({
      username: this.username,
      password: this.password
    }).subscribe(result => {
      if (result.userId !== null) {
        console.log(`Ok!: ${JSON.stringify(result)}`);
        this.router.navigate(['']);
      } else {
        console.log(`Failed!`);
      }
    });
  }

}
