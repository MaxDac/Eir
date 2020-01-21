import { Component, OnInit } from '@angular/core';
import {Perk} from '../../../services/dtos/perk';
import {HelpService} from '../../../services/help.service';

@Component({
  selector: 'app-perks',
  templateUrl: './perks.component.html',
  styleUrls: ['./perks.component.css']
})
export class PerksComponent implements OnInit {
  loaded = false;

  private perks: Perk[];

  get availablePerks(): Perk[] {
    return this.perks;
  }

  constructor(
    private client: HelpService
  ) { }

  ngOnInit() {
    this.client.getPerks()
      .subscribe(p => {
        this.perks = p;
        this.loaded = true;
      });
  }

}
