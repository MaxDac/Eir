import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../services/forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  sections: ForumSection[];

  constructor(
    private provider: ForumService
  ) { }

  ngOnInit() {
    this.provider.getSections()
      .subscribe(s => this.sections = s);
  }

}
