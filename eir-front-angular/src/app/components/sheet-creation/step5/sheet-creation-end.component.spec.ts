import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCreationEndComponent } from './sheet-creation-end.component';

describe('SheetCreationEndComponent', () => {
  let component: SheetCreationEndComponent;
  let fixture: ComponentFixture<SheetCreationEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetCreationEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetCreationEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
