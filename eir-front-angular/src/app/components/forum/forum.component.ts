import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../services/forum.service';
import {PageErrorHandlerService} from '../../services/page-error-handler.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  sections: ForumSection[];

  constructor(
    private provider: ForumService,
    private errorHandler: PageErrorHandlerService
  ) { }

  ngOnInit() {
    this.provider.getSections()
      .subscribe(x => this.errorHandler.handleError(x, s  => this.sections = s));
  }

}
