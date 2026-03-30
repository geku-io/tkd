import {
  //   Ack,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    //  @Ack() ack: (response: { status: string; data: string }) => void,
  ) {
    console.log(data);
    //  ack({ status: 'received', data });
    return data;
  }
}
