import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private http: HttpClient) {
    console.log('GeminiService.constructor()');
  }

  sendMessage(message: string) {
    console.log('GeminiService.sendMessage() ' + message);
    this.http
      .post('http://127.0.0.1:8080/api/ai/message', {
        message: message,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
