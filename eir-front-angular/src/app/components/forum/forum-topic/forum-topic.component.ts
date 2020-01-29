import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ForumService} from '../../../services/forum.service';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

@Component({
  selector: 'app-forum-topic',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.css']
})
export class ForumTopicComponent implements OnInit {
  idTopic: number;
  posts: ForumPost[];

  constructor(
    private route: ActivatedRoute,
    private provider: ForumService,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(p => {
        this.idTopic = Number(p.get('id'));
        this.provider.getPosts(this.idTopic)
          .subscribe(y => this.errorHandler.handleError(y, x => {
            this.posts = x.sort((x1, x2) => {
              if (x1.creationDate > x2.creationDate) {
                return 1;
              } else {
                return -1;
              }
            });
          }));
      });
  }

}
