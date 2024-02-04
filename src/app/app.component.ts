import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './services/gemini.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgFor,NgIf],
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

  conversation: any[] = [
    { message: 'Hey Devon, how are you today? 😁', from: 'gemini' },
    { message: 'Not too bad but feeling a bit stressed lately', from: 'user' },
    {
      message: `Sorry to hear that Devon 😥
      Would you like to talk about it?`,
      from: 'gemini',
    },
  ];

  public sendMessage() {
    const message = this.geminiForm.get('geminiInput')?.value?.toString() ?? '';
    if (message === '') {
      return;
    }
    this.conversation.push({ message, from: 'user' });
    this.geminiService.sendMessage(message);
  }
}
