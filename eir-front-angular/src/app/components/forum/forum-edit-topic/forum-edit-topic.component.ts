import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../../services/forum.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

enum TopicOperation {
  CREATE,
  MODIFY
}

@Component({
  selector: 'app-forum-edit-topic',
  templateUrl: './forum-edit-topic.component.html',
  styleUrls: ['./forum-edit-topic.component.css']
})
export class ForumEditTopicComponent implements OnInit {
  private operation: TopicOperation;
  sectionId: number;
  id: number;
  topic: ForumTopicRequest = {};

  constructor(
    private route: ActivatedRoute,
    private provider: ForumService,
    private router: Router,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(x => {
        if (x.has('sectionId')) {
          this.operation = TopicOperation.CREATE;
          this.sectionId = Number(x.get('sectionId'));
        } else {
          this.operation = TopicOperation.MODIFY;
          this.id = Number(x.get('id'));

          this.provider.getTopic(this.id)
            .subscribe(z => this.errorHandler.handleError(z, t => {
              this.topic = {
                id: t.id,
                sectionId: t.sectionId,
                title: t.title,
                description: t.description
              };
            }));
        }
      });
  }

  saveTopic() {
    if (this.operation === TopicOperation.CREATE) {
      this.topic.sectionId = this.sectionId;
      this.provider.createTopic(this.topic)
        .subscribe(_ => this.router.navigate(['forum/section', this.sectionId]));
    } else {
      this.provider.updateTopic(this.topic)
        .subscribe(_ => this.router.navigate(['forum/section', this.topic.sectionId]));
    }
  }
}
