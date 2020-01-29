import {NgModule} from '@angular/core';
import {
  MatBottomSheetModule,
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule, MatSelectModule,
  MatSidenavModule, MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FlexLayoutModule} from '@angular/flex-layout';

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
    MatCardModule,
    MatBottomSheetModule,
    FlexLayoutModule,
    MatSnackBarModule
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
    MatCardModule,
    MatBottomSheetModule,
    FlexLayoutModule,
    MatSnackBarModule
  ]
})
export class MaterialModule {}
