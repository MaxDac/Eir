import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../../services/forum.service';
import {ActivatedRoute} from '@angular/router';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

@Component({
  selector: 'app-forum-section',
  templateUrl: './forum-section.component.html',
  styleUrls: ['./forum-section.component.css']
})
export class ForumSectionComponent implements OnInit {
  idSection: number;
  topics: ForumTopic[];

  constructor(
    private route: ActivatedRoute,
    private provider: ForumService,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(p => {
        this.idSection = Number(p.get('id'));
        return this.provider.getTopics(this.idSection)
          .subscribe(y => this.errorHandler.handleError(y, x => {
            this.topics = x.sort((x1, x2) => {
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
