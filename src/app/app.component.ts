import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './services/gemini.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalkingHeadsComponent } from "./components/talking-heads/talking-heads.component";
import { ChatPaneComponent } from "./components/chat-pane/chat-pane.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,

        TalkingHeadsComponent,
        ChatPaneComponent
    ]
})
export class AppComponent {

}
