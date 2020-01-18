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
import HttpWrapperService from './services/http-wrapper.service';
import {HttpClientModule} from '@angular/common/http';
import {HelpService} from './services/help.service';
import { CharacteristicsTabComponent } from './components/help/characteristics-tab/characteristics-tab.component';
import { SheetCreationComponent } from './components/sheet-creation/sheet-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacteristicsComponent,
    MenuComponent,
    HomeComponent,
    CharacteristicsTabComponent,
    SheetCreationComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  providers: [
    HttpWrapperService,
    HelpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
