import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CharacteristicsComponent} from './components/help/characteristics/characteristics.component';
import {SheetCreationComponent} from './components/sheet-creation/step1/sheet-creation.component';
import {ChatComponent} from './components/chat/chat.component';
import {SheetCreationAttributesComponent} from './components/sheet-creation/step2/sheet-creation-attributes.component';
import {SheetCreationAbilitiesComponent} from './components/sheet-creation/step3/sheet-creation-abilities.component';
import {SheetCreationPerksComponent} from './components/sheet-creation/step4/sheet-creation-perks.component';
import {PerksComponent} from './components/help/perks/perks.component';
import {SheetCreationEndComponent} from './components/sheet-creation/step5/sheet-creation-end.component';
import {LoginComponent} from './components/login/login.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'help/characteristics', component: CharacteristicsComponent, data: { type: 'Characteristics' } },
  { path: 'help/abilities', component: CharacteristicsComponent, data: { type: 'Abilities' } },
  { path: 'help/perks', component: PerksComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sheet/creation', component: SheetCreationComponent },
  { path: 'sheet/creation/attributes', component: SheetCreationAttributesComponent },
  { path: 'sheet/creation/abilities', component: SheetCreationAbilitiesComponent },
  { path: 'sheet/creation/perks', component: SheetCreationPerksComponent },
  { path: 'sheet/creation/end', component: SheetCreationEndComponent },
  { path: 'chat', component: ChatComponent }
];
