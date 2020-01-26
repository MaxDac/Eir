import { Component, OnInit } from '@angular/core';
import {CharacterService} from '../../services/character.service';
import {ActivatedRoute} from '@angular/router';
import {Character} from '../../services/dtos/character';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  character: Character;

  constructor(
    private service: CharacterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap
      .map(x => x.get('id'))
      .flatMap(id => this.service.getCharacterById(Number(id)))
      .subscribe(x => {
        console.log(`character: ${JSON.stringify(x)}`);
        this.character = x
      });
  }

}
