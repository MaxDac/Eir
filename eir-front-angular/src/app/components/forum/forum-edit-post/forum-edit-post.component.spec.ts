import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumEditPostComponent } from './forum-edit-post.component';

describe('ForumEditPostComponent', () => {
  let component: ForumEditPostComponent;
  let fixture: ComponentFixture<ForumEditPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumEditPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
