import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetSelectionComponent } from './sheet-selection.component';

describe('SheetSelectionComponent', () => {
  let component: SheetSelectionComponent;
  let fixture: ComponentFixture<SheetSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
