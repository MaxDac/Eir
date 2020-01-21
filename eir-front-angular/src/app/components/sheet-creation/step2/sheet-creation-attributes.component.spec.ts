import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetCreationAttributesComponent } from './sheet-creation-attributes.component';

describe('SheetCreationAttributesComponent', () => {
  let component: SheetCreationAttributesComponent;
  let fixture: ComponentFixture<SheetCreationAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetCreationAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetCreationAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
