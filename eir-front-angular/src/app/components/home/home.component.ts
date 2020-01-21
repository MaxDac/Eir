import { Component, OnInit } from '@angular/core';
import HttpWrapperService from '../../services/http-wrapper.service';
import {Characteristic} from '../../services/dtos/characteristic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit() {}

}
