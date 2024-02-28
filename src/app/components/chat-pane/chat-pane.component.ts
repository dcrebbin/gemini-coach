import { ChangeDetectorRef, Component } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'chat-pane',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, MatIconModule, NgClass],
  templateUrl: './chat-pane.component.html',
})
export class ChatPaneComponent {
  geminiForm = new FormBuilder().group({
    geminiInput: new FormControl(''),
  });

  constructor(
    private geminiService: GeminiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    console.log('ChatPane.constructor()');
    // this.speakMessage(0);
  }

  public conversation: any[] = [
    { message: 'Hey Devon, how are you today? 😁', from: 'gemini' },
  ];
  isAudioPlaying = false;
  waitingOnAudio = false;
  waitingOnSpeechRecognition = false;
  waitingOnTextResponse = false;
  autoPlayAudio = true;

  public speakMessage(index: number) {    
    this.waitingOnAudio = true;
    this.changeDetectorRef.detectChanges();
    const message = this.conversation[index].message;
    this.geminiService.textToSpeech(message).subscribe((response: any) => {
      this.waitingOnAudio = false;
      this.changeDetectorRef.detectChanges();
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
        this.waitingOnSpeechRecognition = true;
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const uint8Array = new Uint8Array(await audioBlob.arrayBuffer());
        (await this.geminiService.speechToText(uint8Array)).subscribe(
          (response: any) => {
            this.waitingOnSpeechRecognition = false;
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
    this.waitingOnTextResponse = true;
    this.geminiService.generateMessage(message).subscribe((response: any) => {
      console.log(response);
      this.waitingOnTextResponse = false;
      this.conversation.push({ message: response?.message, from: 'gemini' });
      this.changeDetectorRef.detectChanges();
      if (this.autoPlayAudio) {
        this.speakMessage(this.conversation.length - 1);
      }
    });
  }
}
