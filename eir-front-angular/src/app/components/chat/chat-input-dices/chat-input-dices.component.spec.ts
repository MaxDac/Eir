import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputDicesComponent } from './chat-input-dices.component';

describe('ChatInputDicesComponent', () => {
  let component: ChatInputDicesComponent;
  let fixture: ComponentFixture<ChatInputDicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInputDicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputDicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
