import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameGateway, GameService, GameService],
})
export class AppModule {}
