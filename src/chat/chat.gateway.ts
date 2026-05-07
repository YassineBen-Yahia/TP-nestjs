
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server !: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`[+] Client connecté    : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[-] Client déconnecté  : ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    client.emit('joinedRoom', room);
    console.log(`[room] ${client.id} a rejoint "${room}"`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { room: string; sender: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = this.chatService.save(payload);
    this.server.to(payload.room).emit('receiveMessage', saved);
  }

  @SubscribeMessage('getHistory')
  handleHistory(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const history = this.chatService.getByRoom(room);
    client.emit('history', history);
  }
}