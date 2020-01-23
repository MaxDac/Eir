import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-characteristic-selection',
  templateUrl: './characteristic-selection.component.html',
  styleUrls: ['./characteristic-selection.component.css']
})
export class CharacteristicSelectionComponent implements OnInit {

  @Input()
  minValue: number;

  @Input()
  maxValue: number;

  @Input()
  name: string;

  @Input()
  disablePlus: boolean;

  currentVal: number;

  @Output()
  selectedValue = new EventEmitter<[string, number]>();

  get currentValue(): number {
    if (this.currentVal === undefined) {
      this.currentVal = this.minValue;
    }

    return this.currentVal;
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
