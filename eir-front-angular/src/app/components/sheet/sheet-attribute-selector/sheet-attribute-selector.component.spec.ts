import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetAttributeSelectorComponent } from './sheet-attribute-selector.component';

describe('SheetAttributeSelectorComponent', () => {
  let component: SheetAttributeSelectorComponent;
  let fixture: ComponentFixture<SheetAttributeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetAttributeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetAttributeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
