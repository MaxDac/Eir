import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNavList, MatProgressBarModule,
  MatSidenavModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule
  ]
})
export class MaterialModule {}
