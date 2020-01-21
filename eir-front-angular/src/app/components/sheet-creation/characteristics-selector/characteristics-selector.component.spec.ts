import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicsSelectorComponent } from './characteristics-selector.component';

describe('CharacteristicsSelectorComponent', () => {
  let component: CharacteristicsSelectorComponent;
  let fixture: ComponentFixture<CharacteristicsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
