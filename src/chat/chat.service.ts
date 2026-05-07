
import { Injectable } from '@nestjs/common';

export interface ChatMessage {
  id: number;
  room: string;
  sender: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];
  private counter = 0;

  save(payload: { room: string; sender: string; message: string }): ChatMessage {
    const msg: ChatMessage = {
      id: ++this.counter,
      ...payload,
      timestamp: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  getByRoom(room: string): ChatMessage[] {
    return this.messages.filter((m) => m.room === room);
  }
}