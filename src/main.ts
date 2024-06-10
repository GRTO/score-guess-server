import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import { AppModule } from './app.module';

import { GameGateway } from './game/game.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }));

  const gameGateway = app.get(GameGateway);

  setInterval(() => {
    gameGateway.startRound();
  }, 15_000); // 15 seconds per round (10 seconds betting, 5 seconds result display)

  await app.listen(3000);
}
bootstrap();
