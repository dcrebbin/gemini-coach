import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './services/gemini.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  geminiForm = new FormBuilder().group({
    geminiInput: new FormControl(''),
  });
  constructor(private geminiService: GeminiService) {
    console.log('AppComponent.constructor()');
  }
  public sendMessage() {
    const message = this.geminiForm.get('geminiInput')?.value?.toString() ?? '';
    if (message === '') {
      return;
    }
    this.geminiService.sendMessage(message);
  }
}
