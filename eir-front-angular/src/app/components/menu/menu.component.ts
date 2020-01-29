import { Component, OnInit } from '@angular/core';
import {LogoutService} from '../../services/logout-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private logoutService: LogoutService
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.logoutService.logout();
  }
}
