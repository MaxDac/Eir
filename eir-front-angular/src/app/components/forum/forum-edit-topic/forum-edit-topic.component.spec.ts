import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumEditTopicComponent } from './forum-edit-topic.component';

describe('ForumEditTopicComponent', () => {
  let component: ForumEditTopicComponent;
  let fixture: ComponentFixture<ForumEditTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumEditTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumEditTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
