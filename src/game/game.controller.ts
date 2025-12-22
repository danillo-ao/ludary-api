import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GameSearchResponse } from './game.interfaces';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  @Inject(GameService)
  private readonly gameService: GameService;

  @Get('search/:game')
  async searchGame(@Param('game') game: string): Promise<GameSearchResponse[]> {
    return this.gameService.searchGame(game);
  }
}
