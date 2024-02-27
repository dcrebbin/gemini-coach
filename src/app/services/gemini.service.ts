import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private http: HttpClient) {
    console.log('GeminiService.constructor()');
  }

  async speechToText(uint8Array: Uint8Array) {
    console.log('GeminiService.sendAudio()');
    return this.http.post(
      `${environment.apiBaseUrl}/ai/speech-to-text`,
      {
        audioData: [...uint8Array],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  textToSpeech(message: string) {
    console.log('GeminiService.textToSpeech()');
    return this.http.post<Blob>(
      `${environment.apiBaseUrl}/ai/generate-audio`,
      {
        message: message,
      },
      {
        responseType: 'blob' as 'json',
      }
    );
  }

  generateMessage(message: string) {
    console.log('GeminiService.sendMessage() ' + message);
    return this.http.post(`${environment.apiBaseUrl}/ai/message`, {
      message: message,
    });
  }
}
