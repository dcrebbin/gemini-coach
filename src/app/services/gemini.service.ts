import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
      'http://127.0.0.1:8080/api/ai/speech-to-text',
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
      'http://127.0.0.1:8080/api/ai/generate-audio',
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
    return this.http.post('http://127.0.0.1:8080/api/ai/message', {
      message: message,
    });
  }
}
