import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import { CharacteristicsComponent } from './components/help/characteristics/characteristics.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './routes';
import {HttpWrapperService} from './services/http-wrapper.service';
import {HttpClientModule} from '@angular/common/http';
import {HelpService} from './services/help.service';
import { CharacteristicsTabComponent } from './components/help/characteristics-tab/characteristics-tab.component';
import { SheetCreationComponent } from './components/sheet-creation/step1/sheet-creation.component';
import { ChatComponent } from './components/chat/chat.component';
import {FormsModule} from '@angular/forms';
import { SheetCreationAttributesComponent } from './components/sheet-creation/step2/sheet-creation-attributes.component';
import { CharacteristicSelectionComponent } from './components/sheet-creation/characteristic-selection/characteristic-selection.component';
import { CharacteristicsSelectorComponent } from './components/sheet-creation/characteristics-selector/characteristics-selector.component';
import { SheetCreationAbilitiesComponent } from './components/sheet-creation/step3/sheet-creation-abilities.component';
import { SheetCreationPerksComponent } from './components/sheet-creation/step4/sheet-creation-perks.component';
import { PerksComponent } from './components/help/perks/perks.component';
import { SheetCreationEndComponent } from './components/sheet-creation/step5/sheet-creation-end.component';
import {CookieService} from 'ngx-cookie-service';
import {CharacterService} from './services/character.service';
import { LoginComponent } from './components/login/login.component';
import { NameChangingDirectiveDirective } from './directives/name-changing-directive.directive';
import {AuthenticationService} from './services/authentication.service';
import {CanActivateViaAuthGuard} from './services/can-activate-via-auth.guard';
import { ForumComponent } from './components/forum/forum.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { SheetSelectionComponent } from './components/sheet/sheet-selection/sheet-selection.component';
import { ChatRoomsComponent } from './components/chat/chat-rooms/chat-rooms.component';
import { ChatInputComponent } from './components/chat/chat-input/chat-input.component';
import { ChatRowsComponent } from './components/chat/chat-rows/chat-rows.component';
import { ForumSectionComponent } from './components/forum/forum-section/forum-section.component';
import { ForumTopicComponent } from './components/forum/forum-topic/forum-topic.component';
import { ForumEditPostComponent } from './components/forum/forum-edit-post/forum-edit-post.component';
import { ForumEditTopicComponent } from './components/forum/forum-edit-topic/forum-edit-topic.component';
import {ForumService} from './services/forum.service';
import { CharacterSelectorComponent } from './components/character-selector/character-selector.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SheetAttributeSelectorComponent } from './components/sheet/sheet-attribute-selector/sheet-attribute-selector.component';
import {WebsocketWrapperService} from './services/websocket-wrapper.service';
import { SheetUpdateComponent } from './components/sheet/sheet-update/sheet-update.component';
import { ChatInputDicesComponent } from './components/chat/chat-input-dices/chat-input-dices.component';
import {StorageService} from './services/storage.service';
import { MenuBottomComponent } from './components/menu/menu-bottom.component';
import {LogoutService} from './services/logout-service';
import {PageErrorHandlerService} from './services/page-error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    CharacteristicsComponent,
    MenuComponent,
    HomeComponent,
    CharacteristicsTabComponent,
    SheetCreationComponent,
    ChatComponent,
    SheetCreationAttributesComponent,
    CharacteristicSelectionComponent,
    CharacteristicsSelectorComponent,
    SheetCreationAbilitiesComponent,
    SheetCreationPerksComponent,
    PerksComponent,
    SheetCreationEndComponent,
    LoginComponent,
    NameChangingDirectiveDirective,
    ForumComponent,
    SheetComponent,
    SheetSelectionComponent,
    ChatRoomsComponent,
    ChatInputComponent,
    ChatRowsComponent,
    ForumSectionComponent,
    ForumTopicComponent,
    ForumEditPostComponent,
    ForumEditTopicComponent,
    CharacterSelectorComponent,
    SheetAttributeSelectorComponent,
    SheetUpdateComponent,
    ChatInputDicesComponent,
    MenuBottomComponent
  ],
  entryComponents: [
    ChatInputDicesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true}),
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    HttpWrapperService,
    AuthenticationService,
    WebsocketWrapperService,
    HelpService,
    CharacterService,
    CanActivateViaAuthGuard,
    StorageService,
    CookieService,
    ForumService,
    LogoutService,
    PageErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
