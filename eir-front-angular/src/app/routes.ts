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
import {CanActivateViaAuthGuard} from './services/can-activate-via-auth.guard';
import {ForumComponent} from './components/forum/forum.component';
import {SheetSelectionComponent} from './components/sheet/sheet-selection/sheet-selection.component';
import {SheetComponent} from './components/sheet/sheet.component';
import {ChatRoomsComponent} from './components/chat/chat-rooms/chat-rooms.component';
import {ForumSectionComponent} from './components/forum/forum-section/forum-section.component';
import {ForumTopicComponent} from './components/forum/forum-topic/forum-topic.component';
import {ForumEditTopicComponent} from './components/forum/forum-edit-topic/forum-edit-topic.component';
import {ForumEditPostComponent} from './components/forum/forum-edit-post/forum-edit-post.component';
import {SheetUpdateComponent} from './components/sheet/sheet-update/sheet-update.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'help/characteristics', component: CharacteristicsComponent,
    data: { type: 'Characteristics' }, canActivate: [CanActivateViaAuthGuard] },
  { path: 'help/abilities', component: CharacteristicsComponent, data: { type: 'Abilities' }, canActivate: [CanActivateViaAuthGuard] },
  { path: 'help/perks', component: PerksComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'sheet/selection', component: SheetSelectionComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/creation', component: SheetCreationComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/creation/attributes', component: SheetCreationAttributesComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/creation/abilities', component: SheetCreationAbilitiesComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/creation/perks', component: SheetCreationPerksComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/creation/end', component: SheetCreationEndComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/update/:id', component: SheetUpdateComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'sheet/:id', component: SheetComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'rooms', component: ChatRoomsComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum', component: ForumComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/section/:id', component: ForumSectionComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/topic/create/:sectionId', component: ForumEditTopicComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/post/create/:topicId', component: ForumEditPostComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/topic/edit/:id', component: ForumEditTopicComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/post/edit/:id', component: ForumEditPostComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forum/topic/:id', component: ForumTopicComponent, canActivate: [CanActivateViaAuthGuard] }
];
