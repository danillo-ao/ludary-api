import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IgdbService } from 'src/igdb/igdb.service';
import { GameSearchResponse } from './game.interfaces';
import IGDBQueries from 'src/igdb/igdb.queries';
import { GAME_RESPONSES } from './game.constants';

@Injectable()
export class GameService {
  @Inject(IgdbService)
  private readonly igdbService: IgdbService;

  /**
   * @param game - The query to search for
   * @returns The games found
   */
  async searchGame(game: string): Promise<GameSearchResponse[]> {
    const queryString = IGDBQueries.searchGame(game);
    const queryStringByName = IGDBQueries.searchGameByName(game);
    const igdbClient = this.igdbService.getClient();

    try {
      const [queryStringResult, queryStringByNameResult] = await Promise.all([
        igdbClient.post('/games', queryString),
        igdbClient.post('/games', queryStringByName),
      ]);

      // Combine both result sets, ensuring uniqueness by 'id'
      const combinedMap = new Map<number, GameSearchResponse>();
      [...queryStringResult.data, ...queryStringByNameResult.data].forEach((item: GameSearchResponse) => {
        combinedMap.set(item.id, item);
      });
      const unifiedResults: GameSearchResponse[] = Array.from(combinedMap.values());

      return unifiedResults;
    } catch (_) {
      throw new BadRequestException('Failed to search game', {
        description: GAME_RESPONSES.GAME_SEARCH_FAILED,
      });
    }
  }
}
