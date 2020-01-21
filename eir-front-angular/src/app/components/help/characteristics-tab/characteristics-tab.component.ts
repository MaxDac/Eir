import {Component, Input, OnInit} from '@angular/core';
import {Characteristic} from '../../../services/dtos/characteristic';

@Component({
  selector: 'app-characteristics-tab',
  templateUrl: './characteristics-tab.component.html',
  styleUrls: ['./characteristics-tab.component.css']
})
export class CharacteristicsTabComponent implements OnInit {

  private characts: Characteristic[];

  @Input()
  set characteristics(value: Characteristic[]) {
    this.characts = value;
  }

  get characteristics(): Characteristic[] {
    return this.characts;
  }

  constructor() { }

  ngOnInit() {
  }

}
