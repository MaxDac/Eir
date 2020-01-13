import { Component, OnInit } from '@angular/core';
import Characteristic, {MartialAttribute, MentalAttribute} from '../../../services/dtos/characteristic';
import {HelpService} from '../../../services/help.service';
import {ActivatedRoute} from '@angular/router';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-characteristics',
  templateUrl: './characteristics.component.html',
  styleUrls: ['./characteristics.component.css']
})
export class CharacteristicsComponent implements OnInit {

  martials: Characteristic[];
  mentals: Characteristic[];

  loaded = false;

  private filterCharacteristics(characteristics: Characteristic[], type: string): Characteristic[] {
    if (characteristics === null) { return []; }

    return characteristics.filter(x => x.type === type);
  }

  constructor(
    private client: HelpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
      .pipe(
        flatMap(x => {
          if (x.type === 'Characteristics') {
            return this.client.getCharacteristics();
          } else {
            return this.client.getAbilities;
          }
        })
      )
      .subscribe(x => {
        console.log(`x: ${JSON.stringify(x)}`);
        this.martials = this.filterCharacteristics(x, MartialAttribute);
        this.mentals = this.filterCharacteristics(x, MentalAttribute);
        console.log(`martials: ${JSON.stringify(this.martials)}`);
        this.loaded = true;
      });
  }

}
