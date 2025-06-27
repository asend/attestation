import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Remplace par l'URL de ton backend Socket.IO
  }

  // Exemple d'envoi d'événement
  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
    console.log(msg);
    
  }

  // Exemple de réception d'événement
  onMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('message', (data: string) => {
        observer.next(data);
      });
    });
  }

  // Déconnexion propre
  disconnect(): void {
    this.socket.disconnect();
  }
}