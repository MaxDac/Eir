import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ForumService} from '../../../services/forum.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

enum PostOperation {
  CREATE,
  MODIFY
}

@Component({
  selector: 'app-forum-edit-post',
  templateUrl: './forum-edit-post.component.html',
  styleUrls: ['./forum-edit-post.component.css']
})
export class ForumEditPostComponent implements OnInit {
  private operation: PostOperation;
  topicId: number;
  id: number;
  post: ForumPostRequest = {};

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private provider: ForumService,
    private router: Router,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(x => {
        if (x.has('topicId')) {
          this.operation = PostOperation.CREATE;
          this.topicId = Number(x.get('topicId'));
        } else {
          this.operation = PostOperation.MODIFY;
          this.id = Number(x.get('id'));

          this.provider.getPost(this.id)
            .subscribe(y => this.errorHandler.handleError(y, t => {
              this.post = {
                id: t.id,
                content: t.content,
                userId: t.user.id,
                topicId: t.topicId
              };
            }));
        }
      });
  }

  saveTopic() {
    if (this.operation === PostOperation.CREATE) {
      this.post.topicId = this.topicId;
      this.post.userId = this.authenticationService.retrieveStoredSession().userId;
      this.provider.createPost(this.post)
        .subscribe(_ => this.router.navigate(['forum/topic', this.topicId]));
    } else {
      this.provider.updatePost(this.post)
        .subscribe(_ => this.router.navigate(['forum/topic', this.post.topicId]));
    }
  }
}
