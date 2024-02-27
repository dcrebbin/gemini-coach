import { Component } from '@angular/core';

@Component({
  selector: 'talking-heads',
  standalone: true,
  imports: [],
  templateUrl: './talking-heads.component.html',
})
export class TalkingHeadsComponent {
  constructor() {
    console.log('TalkingHeadsComponent.constructor()');
  }
}
