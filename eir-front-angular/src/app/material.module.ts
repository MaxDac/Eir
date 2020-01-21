import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule, MatSelectModule,
  MatSidenavModule, MatStepperModule, MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {DragDropModule} from '@angular/cdk/drag-drop';

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
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatGridListModule,
    DragDropModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    MatCardModule
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
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatGridListModule,
    DragDropModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    MatCardModule
  ]
})
export class MaterialModule {}
