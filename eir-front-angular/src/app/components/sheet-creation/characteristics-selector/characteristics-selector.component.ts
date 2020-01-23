import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Characteristic, MartialAttribute, MentalAttribute} from '../../../services/dtos/characteristic';

@Component({
  selector: 'app-characteristics-selector',
  templateUrl: './characteristics-selector.component.html',
  styleUrls: ['./characteristics-selector.component.css']
})
export class CharacteristicsSelectorComponent implements OnInit {

  @Input()
  characteristics: Characteristic[];

  @Input()
  minValue: number;

  @Input()
  maxMartialValue: number;

  @Input()
  maxMentalValue: number;

  @Output()
  isCompleted = new EventEmitter<boolean>();

  disableMartialPlus: boolean;
  disableMentalPlus: boolean;

  get minimumValue(): number {
    return this.minValue === undefined ? 0 : this.minValue;
  }

  private sumPerAttribute(attribute: string): number {
    if (this.characteristics !== undefined) {
      return this.characteristics
        .filter(x => x.type === attribute)
        .map(x => x.value)
        .reduce((p, v) => p + v);
    } else {
      return this.minimumValue;
    }
  }

  get totalMartials(): number {
    const totalSum = this.sumPerAttribute(MartialAttribute);
    return (this.maxMartialValue === undefined ?
      0 :
      this.maxMartialValue) - totalSum;
  }

  get totalMentals(): number {
    const totalSum = this.sumPerAttribute(MentalAttribute);
    return (this.maxMentalValue === undefined ?
      0 :
      this.maxMentalValue) - totalSum;
  }

  ngOnInit() {
  }

  private checkAllowPlus() {
    this.disableMartialPlus = this.totalMartials === 0;
    this.disableMentalPlus = this.totalMentals === 0;
    this.isCompleted.emit(this.totalMartials === 0 && this.totalMentals === 0);
  }

  onSelected(info: [string, number]) {
    this.characteristics.forEach(c => {
      if (c.name === info[0]) {
        c.value = info[1] === undefined ? this.minimumValue : info[1];
      }
    });

    this.checkAllowPlus();
  }
}
