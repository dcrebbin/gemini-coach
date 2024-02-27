import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TalkingHeadsComponent } from './components/talking-heads/talking-heads.component';
import { ChatPaneComponent } from './components/chat-pane/chat-pane.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, TalkingHeadsComponent, ChatPaneComponent],
})
export class AppComponent {
  constructor() {
    console.log('AppComponent.constructor()');
  }
}
