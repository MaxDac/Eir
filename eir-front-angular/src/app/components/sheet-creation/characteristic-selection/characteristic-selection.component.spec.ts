import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicSelectionComponent } from './characteristic-selection.component';

describe('CharacteristicSelectionComponent', () => {
  let component: CharacteristicSelectionComponent;
  let fixture: ComponentFixture<CharacteristicSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
