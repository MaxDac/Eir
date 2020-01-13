import {Component, Input, OnInit} from '@angular/core';
import Characteristic from '../../../services/dtos/characteristic';

@Component({
  selector: 'app-characteristics-tab',
  templateUrl: './characteristics-tab.component.html',
  styleUrls: ['./characteristics-tab.component.css']
})
export class CharacteristicsTabComponent implements OnInit {

  private characts: Characteristic[];

  @Input()
  set characteristics(value: Characteristic[]) {
    console.log(`setting: ${JSON.stringify(value)}`);
    this.characts = value;
  }

  get characteristics(): Characteristic[] {
    console.log(`getting: ${JSON.stringify(this.characts)}`);
    return this.characts;
  }

  constructor() { }

  ngOnInit() {
  }

}
