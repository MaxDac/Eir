import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../../services/forum.service';
import {ActivatedRoute} from '@angular/router';

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
    private provider: ForumService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .flatMap(p => {
        this.idSection = Number(p.get('id'));
        return this.provider.getTopics(this.idSection)
          .map(x => x.sort((x1, x2) => {
            if (x1.creationDate > x2.creationDate) {
              return 1;
            } else {
              return -1;
            }
          }));
      })
      .subscribe(ts => this.topics = ts);
  }

}
