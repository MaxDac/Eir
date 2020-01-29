import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNull} from '../../../helpers';

@Component({
  selector: 'app-characteristic-selection',
  templateUrl: './characteristic-selection.component.html',
  styleUrls: ['./characteristic-selection.component.css']
})
export class CharacteristicSelectionComponent implements OnInit {
  private internalDisablePlus: boolean;

  @Input()
  minValue: number;

  @Input()
  maxValue: number;

  @Input()
  name: string;

  @Input()
  set disablePlus(val: boolean) {
    this.internalDisablePlus = val;
  }

  get disablePlus(): boolean {
    const returnValue = isNull(this.internalDisablePlus) ? false : this.internalDisablePlus;
    return returnValue;
  }

  currentVal: number;

  @Output()
  selectedValue = new EventEmitter<[string, number]>();

  get currentValue(): number {
    if (this.currentVal === undefined) {
      this.currentVal = this.minValue;
    }

    return this.currentVal;
  }

  get minusDisabled(): boolean {
    return isNull(this.currentVal) ? true : this.currentVal <= this.minValue;
  }

  get plusDisabled(): boolean {
    return this.disablePlus || this.currentVal >= this.maxValue;
  }

  constructor() { }

  ngOnInit() {
    this.selectedValue.emit([this.name, this.currentVal]);
  }

  increaseValue() {
    if (this.currentVal < this.maxValue && !this.disablePlus) {
      this.currentVal += 1;
      this.selectedValue.emit([this.name, this.currentVal]);
    }
  }

  decreaseValue() {
    if (this.currentVal > this.minValue) {
      this.currentVal -= 1;
      this.selectedValue.emit([this.name, this.currentVal]);
    }
  }

}
