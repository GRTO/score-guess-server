import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { map } from 'rxjs';

import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  afterInit(server: Server): void {
    this.gameService.phaseSubject
      .pipe(
        map((phase) => ({ phase })),
      )
      .subscribe((phaseChange) => {
        this.emitMessage('gamePhase', phaseChange);
      });
  }

  private emitMessage<T = unknown>(type: string, message: T): void {
    this.server.emit(type, message);
  }

  @SubscribeMessage('placeBet')
  handlePlaceBet(
    @MessageBody() data: { player: string; slot: number; amount: number },
  ): void {
    this.gameService.placeBet(data.player, data.slot, data.amount);
  }

  // Emit the current phase to newly connected clients
  @SubscribeMessage('getPhase')
  handleGetPhase(@MessageBody() data: any): void {
    this.emitMessage('gamePhase', { phase: this.gameService.getPhase() });
  }

  // Method to start a new round and emit the result
  startRound(): void {
    this.gameService.startRound().then((result) => {
      this.emitMessage('roundResult', { winnerList: result });
      this.emitMessage('gamePhase', { phase: this.gameService.getPhase() });
    });
  }
}
