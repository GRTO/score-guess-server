import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';

interface Bet {
  player: string;
  slot: number;
  amount: number;
}

enum GamePhase {
  WAITING = 'WAITING',
  BETTING = 'BETTING',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
}

@Injectable()
export class GameService {
  private bets: Bet[] = [];
  private _phase: GamePhase = GamePhase.WAITING;
  public phaseSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this._phase);

  constructor() {}

  get phase(): GamePhase {
    return this._phase;
  }

  set phase(value: GamePhase) {
    this._phase = value;
    this.phaseSubject.next(value); // Emit phase changes to observers
  }

  getPhase(): GamePhase {
    return this._phase;
  }

  placeBet(player: string, slot: number, amount: number): void {
    if (this.phase === GamePhase.BETTING) {
      this.bets.push({ player, slot, amount });
    }
  }

  async startRound(): Promise<{ winningSlot: number; winners: string[] }> {
    this.phase = GamePhase.BETTING;

    // Simulate a delay for the betting phase
    await new Promise((resolve) => setTimeout(resolve, 10_000)); // 10 seconds betting time

    this._phase = GamePhase.PROCESSING;

    // Generate a random winning slot
    const winningSlot = Math.floor(Math.random() * 6);

    // Determine winners
    const winners = this.bets
      .filter((bet) => bet.slot === winningSlot)
      .map((bet) => bet.player);

    this.phase = GamePhase.RESULTS;

    // Clear bets for the next round
    this.bets = [];
    // this.phase = GamePhase.WAITING;


    return { winningSlot, winners };
  }
}
