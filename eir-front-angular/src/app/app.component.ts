import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNull} from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private currentUrl: string;

  get showMenu(): boolean {
    return isNull(this.currentUrl) || this.currentUrl !== '/login';
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      this.currentUrl = this.router.url;
    });
  }
}
