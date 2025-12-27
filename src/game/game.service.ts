import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IgdbService } from 'src/igdb/igdb.service';
import { GameSearchResponse } from './game.interfaces';
import IGDBQueries from 'src/igdb/igdb.queries';
import { GAME_RESPONSES } from './game.constants';

@Injectable()
export class GameService {
  @Inject(IgdbService)
  private readonly igdbService: IgdbService;

  // ===============================
  // GAME SEARCH OPERATIONS
  // ===============================

  /**
   * Searches for games using IGDB API by combining results from search and name-based queries.
   * Returns a unified list of unique games based on their ID.
   * @param game The search query string
   * @returns Array of unique game search results
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
