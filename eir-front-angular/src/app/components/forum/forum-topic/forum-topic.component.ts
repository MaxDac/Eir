import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ForumService} from '../../../services/forum.service';

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
    private provider: ForumService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .flatMap(p => {
        this.idTopic = Number(p.get('id'));
        return this.provider.getPosts(this.idTopic)
          .map(x => x.sort((x1, x2) => {
            if (x1.creationDate > x2.creationDate) {
              return 1;
            } else {
              return -1;
            }
          }));
      })
      .subscribe(ts => this.posts = ts);
  }

}
