import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCreationComponent } from './sheet-creation.component';

describe('SheetCreationComponent', () => {
  let component: SheetCreationComponent;
  let fixture: ComponentFixture<SheetCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
