import { Component, OnInit } from '@angular/core';
import {HelpService} from '../../../services/help.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxChange} from '@angular/material';
import {checkCharacterState, last, setCharacterState} from '../sheet-creation-helpers';
import {tryGetState} from '../../../base/route-utils';
import {Character} from '../../../services/dtos/character';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

interface VisualEffect {
  name: string;
  value: number;
}

interface VisualPerk {
  id: number;
  name: string;
  description: string;
  negative: boolean;
  effects: VisualEffect[] | null;
}

@Component({
  selector: 'app-sheet-creation-perks',
  templateUrl: './sheet-creation-perks.component.html',
  styleUrls: ['./sheet-creation-perks.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SheetCreationPerksComponent implements OnInit {
  private character: Character;

  get dataSource() { return this.perks; }

  columnsToDisplay = ['select', 'name', 'negative'];
  expandedElement: VisualPerk | null;
  private perks: VisualPerk[] = [];

  selection = new SelectionModel<VisualPerk>(true, []);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private client: HelpService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.character = checkCharacterState(this.cookieService, this.router, 3);

    this.client.getPerks()
      .subscribe(ps => this.perks = ps
        .map(p => {
          return {
            id: p.id,
            name: p.name,
            description: p.description,
            negative: p.negative,
            effects: p.affectedCharacteristic !== null && p.affectedCharacteristic !== undefined ?
              p.affectedCharacteristic.map(e => {
                return {
                  name: e.characteristic.name,
                  value: e.value
                };
              }) :
              null
          };
        }));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  checkSelected(row: VisualPerk, event: MatCheckboxChange) {
    this.selection.toggle(row);

    const positives = this.selection.selected.filter(x => !x.negative);
    const negatives = this.selection.selected.filter(x => x.negative);

    if (negatives.length > 2 || positives.length - negatives.length > 1) {
      this.selection.deselect(row);
      event.source.checked = false;
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: VisualPerk): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  proceed() {
    this.character.perks = this.selection.selected.map(s => {
        return {
          id: s.id,
          name: s.name,
          description: '',
          negative: s.negative,
          affectedCharacteristic: []
        };
      }
    );

    this.cookieService.set('app-character', JSON.stringify(this.character));

    this.router.navigate(['sheet/creation/end'], {
      state: this.character
    });
  }

  goBack() {
    this.character.martialAbilities = null;
    this.character.mentalAbilities = null
    setCharacterState(this.cookieService, this.character);
    this.router.navigate(['sheet/creation/abilities'], {
      state: this.character
    });
  }
}
