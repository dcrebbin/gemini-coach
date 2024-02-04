import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './services/gemini.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatIconModule,
    NgClass,
  ],
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

  public speakMessage(index: number) {
    alert('Speaking message: ' + this.conversation[index].message);
    const speech = new SpeechSynthesisUtterance(
      this.conversation[index].message
    );
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }

  mediaRecorder: any;

  microphoneOnClass: string =
    'absolute right-0 p-2 mx-2 flex items-center text-red-500';
  microphoneOffClass: string = 'absolute right-0 p-2 mx-2 flex items-center';
  microphoneClass: string = this.microphoneOffClass;
  isRecording = false;

  public interactWithMicrophone() {
    if (this.isRecording) {
      this.stopAudio();
      this.isRecording = false;
    } else {
      this.recordAudio();
      this.isRecording = true;
    }
  }

  public recordAudio() {
    this.microphoneClass = this.microphoneOnClass;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = (e: any) => {
        const audioURL = URL.createObjectURL(e.data);
        const audio = new Audio(audioURL);
        audio.play();
      };
    });
  }

  public stopAudio() {
    this.microphoneClass = this.microphoneOffClass;
    this.mediaRecorder.stop();
  }

  public sendMessage() {
    const message = this.geminiForm.get('geminiInput')?.value?.toString() ?? '';
    if (message === '') {
      return;
    }
    this.conversation.push({ message, from: 'user' });
    this.geminiService.sendMessage(message).subscribe((response: any) => {
      console.log(response);
      this.conversation.push({ message: response?.message, from: 'gemini' });
    });
  }
}
