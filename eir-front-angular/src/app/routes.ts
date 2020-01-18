import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CharacteristicsComponent} from './components/help/characteristics/characteristics.component';
import {SheetCreationComponent} from './components/sheet-creation/sheet-creation.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'help/characteristics', component: CharacteristicsComponent, data: { type: 'Characteristics' } },
  { path: 'help/abilities', component: CharacteristicsComponent, data: { type: 'Abilities' } },
  { path: 'sheet/creation', component: SheetCreationComponent }
];
