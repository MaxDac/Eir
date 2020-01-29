import { Component, OnInit } from '@angular/core';
import {LogoutService} from '../../services/logout-service';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {

  constructor(
    private logoutService: LogoutService
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.logoutService.logout();
  }
}
