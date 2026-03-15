import {
  //   Ack,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  port: 3001,
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

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
