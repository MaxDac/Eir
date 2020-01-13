import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicsTabComponent } from './characteristics-tab.component';

describe('CharacteristicsTabComponent', () => {
  let component: CharacteristicsTabComponent;
  let fixture: ComponentFixture<CharacteristicsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
