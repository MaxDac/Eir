import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {isNull} from '../../../helpers';
import {HelpService} from '../../../services/help.service';
import {Characteristic} from '../../../services/dtos/characteristic';
import {DiceCallback} from '../chat-input/chat-input.component';
import {CharacterService} from '../../../services/character.service';
import {Character} from '../../../services/dtos/character';
import {PageErrorHandlerService} from '../../../services/page-error-handler.service';

enum ViewMode {
  CD,
  OPPONENT
}

@Component({
  selector: 'app-chat-input-dices',
  templateUrl: './chat-input-dices.component.html',
  styleUrls: ['./chat-input-dices.component.css']
})
export class ChatInputDicesComponent implements OnInit {
  private attributes: Characteristic[];
  private abilities: Characteristic[];
  private characters: Character[];
  cds = Array.from({length: (40)}, (v, k) => k + 1);

  selectedAttribute: number;
  selectedAbility: number;
  cdClass = 15;
  selectedCharacterId: number;
  selectedOpponentAttributeId: number;
  selectedOpponentAbilityId: number;

  mode = ViewMode.CD;

  get changeViewButtonLabel(): string {
    if (this.mode === ViewMode.CD) {
      return 'Antagonista';
    } else {
      return 'CD';
    }
  }

  get isCD(): boolean {
    return this.mode === ViewMode.CD;
  }

  get diceAttributes(): Characteristic[] {
    return this.attributes;
  }

  get diceAbilities(): Characteristic[] {
    return this.abilities;
  }

  get opponents(): Character[] {
    return this.characters;
  }

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ChatInputDicesComponent>,
    private provider: HelpService,
    private charactersProvider: CharacterService,
    private errorHandler: PageErrorHandlerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DiceCallback
  ) { }

  ngOnInit() {
    this.provider.getCharacteristics()
      .subscribe(x => this.errorHandler.handleError(x, cs => this.attributes = cs));

    this.provider.getAbilities()
      .subscribe(x => this.errorHandler.handleError(x, abs => this.abilities = abs));

    this.charactersProvider.getCharacterByRoomId(this.data.roomId)
      .subscribe(x => this.errorHandler.handleError(x, cs => this.characters = cs));
  }

  changeView($event: MouseEvent) {
    this.mode = this.mode === ViewMode.CD ? ViewMode.OPPONENT : ViewMode.CD;
  }

  throwDice(event: MouseEvent) {
    if (!isNull(this.data) && !isNull(this.data.callback)) {
      this.data.callback(this.data.self, {
        attributeId: this.selectedAttribute,
        abilityId: this.selectedAbility,
        cd: this.cdClass
      });
    }

    this.close(event);
  }

  close(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
