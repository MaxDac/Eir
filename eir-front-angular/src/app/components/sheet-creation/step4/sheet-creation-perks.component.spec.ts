import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCreationPerksComponent } from './sheet-creation-perks.component';

describe('SheetCreationPerksComponent', () => {
  let component: SheetCreationPerksComponent;
  let fixture: ComponentFixture<SheetCreationPerksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetCreationPerksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetCreationPerksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
