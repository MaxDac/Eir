import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetUpdateComponent } from './sheet-update.component';

describe('SheetUpdateComponent', () => {
  let component: SheetUpdateComponent;
  let fixture: ComponentFixture<SheetUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
