import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket; // Updated type
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onopen = (event) => {
      console.log('WebSocket connection established', event);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error', event);
    };
  }
  //  send a message
  sendMessage(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
   //return this.socket.asObservable();
  }
  

  // closeConnection(): void {
  //   this.socket.complete();
  // }
  }

