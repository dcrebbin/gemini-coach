import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService } from './services/gemini.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

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

  constructor(
    private geminiService: GeminiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    console.log('AppComponent.constructor()');
  }

  public conversation: any[] = [
    { message: 'Hey Devon, how are you today? 😁', from: 'gemini' },
    { message: 'Not too bad but feeling a bit stressed lately', from: 'user' },
    {
      message: `Sorry to hear that Devon 😥
      Would you like to talk about it?`,
      from: 'gemini',
    },
  ];
  isAudioPlaying = false;

  public speakMessage(index: number) {
    const message = this.conversation[index].message;
    this.geminiService.textToSpeech(message).subscribe((response: any) => {
      const audio = new Audio(URL.createObjectURL(response));
      audio.play();
    });
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
      let audioChunks: any = [];
      this.mediaRecorder.ondataavailable = async (e: any) => {
        audioChunks.push(e.data);
      };
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const uint8Array = new Uint8Array(await audioBlob.arrayBuffer());

        (await this.geminiService.speechToText(uint8Array)).subscribe(
          (response: any) => {
            this.sendMessage(response.text);
            this.changeDetectorRef.detectChanges();
          }
        );
      };
    });
  }

  public stopAudio() {
    this.microphoneClass = this.microphoneOffClass;
    this.mediaRecorder.stop();
  }

  public sendButton() {
    this.sendMessage(
      this.geminiForm.get('geminiInput')?.value?.toString() ?? ''
    );
  }

  sendMessage(message: string) {
    if (message === '') {
      return;
    }
    this.conversation.push({ message: message, from: 'user' });
    this.geminiService.generateMessage(message).subscribe((response: any) => {
      console.log(response);
      this.conversation.push({ message: response?.message, from: 'gemini' });
      this.changeDetectorRef.detectChanges();
    });
  }
}
