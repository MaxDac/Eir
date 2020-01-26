import {Component, Input, OnInit} from '@angular/core';
import {Characteristic} from '../../../services/dtos/characteristic';

@Component({
  selector: 'app-sheet-attribute-selector',
  templateUrl: './sheet-attribute-selector.component.html',
  styleUrls: ['./sheet-attribute-selector.component.css']
})
export class SheetAttributeSelectorComponent implements OnInit {
  @Input()
  characteristic: Characteristic;

  get isDisabled(): boolean {
    return true;
  }

  constructor() { }

  ngOnInit() {
  }

  increaseCharacteristic() {

  }
}
