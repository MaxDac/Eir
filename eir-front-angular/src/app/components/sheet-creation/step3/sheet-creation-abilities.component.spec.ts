import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCreationAbilitiesComponent } from './sheet-creation-abilities.component';

describe('SheetCreationAbilitiesComponent', () => {
  let component: SheetCreationAbilitiesComponent;
  let fixture: ComponentFixture<SheetCreationAbilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetCreationAbilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetCreationAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
