import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRowsComponent } from './chat-rows.component';

describe('ChatRowsComponent', () => {
  let component: ChatRowsComponent;
  let fixture: ComponentFixture<ChatRowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
