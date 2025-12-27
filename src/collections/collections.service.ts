import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddGameToCollectionDto,
  COLLECTION_TYPE,
  CollectionDto,
  FavoriteGameDto,
  RemoveGameFromCollectionDto,
  SetGameStatusDto,
} from './collections.dto';
import { User } from '@supabase/supabase-js';
import { COLLECTIONS_RESPONSES } from './collections.constants';
import {
  CollectionResponse,
  FavoriteGameListResponse,
  GameInCollectionListResponse,
  GameStatusListResponse,
} from './collections.interface';
import { Collections, GameStatusEnum, UserMetrics } from '@prisma/client';
import { parseCollection } from './collections.utils';
import { UserHelper } from 'src/user/user.helper';
import { UserMetricsResponse } from 'src/user/user.interfaces';
import { PaginatedResponse } from 'src/utils/pagination/pagination.interface';
import { createPaginatedResponse } from 'src/utils/pagination/pagination.util';

@Injectable()
export class CollectionsService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  // ===============================
  // PRIVATE HELPER METHODS
  // ===============================

  /**
   * Handles the "game already added" error by checking if the error matches
   * and throwing a BadRequestException if it does.
   * @param err The error to check
   * @throws BadRequestException if the error matches the "game already added" pattern
   */
  private handleGameAlreadyAddedError(err: unknown): void {
    if (err instanceof Error && err.message === COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED) {
      throw new BadRequestException('Game already added to collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED,
      });
    }
  }

  // ===============================
  // COLLECTION CRUD OPERATIONS
  // ===============================

  /**
   * Creates a new collection for the user.
   * @param body Collection data (name, description, icon, color, public)
   * @param user The authenticated user
   * @returns The created collection
   */
  async createCollection(body: CollectionDto, user: User): Promise<CollectionResponse> {
    try {
      const collection = await this.prisma.collections.create({
        data: {
          name: body.name,
          description: body.description,
          icon: BigInt(body.icon),
          color: BigInt(body.color),
          public: body.public,
          user: { connect: { id: user.id } },
        },
      });

      return parseCollection(collection);
    } catch (_) {
      throw new BadRequestException('Failed to create collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_CREATE_FAILED,
      });
    }
  }

  /**
   * Updates an existing collection.
   * @param id Collection ID
   * @param body Updated collection data
   * @param user The authenticated user
   * @returns The updated collection
   */
  async updateCollection(id: number, body: CollectionDto, user: User): Promise<CollectionResponse> {
    try {
      const collection = await this.prisma.collections.update({
        where: { id, idUser: user.id },
        data: {
          name: body.name,
          description: body.description,
          icon: BigInt(body.icon),
          color: BigInt(body.color),
          public: body.public,
        },
      });

      return parseCollection(collection);
    } catch (_) {
      throw new BadRequestException('Failed to update collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_UPDATE_FAILED,
      });
    }
  }

  /**
   * Retrieves all collections for the user.
   * @param user The authenticated user
   * @returns Array of user's collections
   */
  async getCollections(user: User): Promise<CollectionResponse[]> {
    try {
      const collections = await this.prisma.collections.findMany({
        where: { idUser: user.id },
        orderBy: { createDate: 'desc' },
      });

      return collections.map(parseCollection);
    } catch (_) {
      throw new BadRequestException('Failed to get collections', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }

  /**
   * Deletes a collection.
   * @param id Collection ID
   * @param user The authenticated user
   */
  async deleteCollection(id: number, user: User): Promise<void> {
    try {
      await this.prisma.collections.delete({ where: { id, idUser: user.id } });
    } catch (_) {
      throw new BadRequestException('Failed to delete collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_DELETE_FAILED,
      });
    }
  }

  // ===============================
  // FAVORITE GAMES OPERATIONS
  // ===============================

  /**
   * Adds a game to the user's favorites.
   * @param body Game data to favorite
   * @param user The authenticated user
   * @returns Updated user metrics
   */
  async favoriteGame(body: FavoriteGameDto, user: User): Promise<UserMetricsResponse> {
    try {
      const favoriteAlreadyExists = await this.prisma.favorites.findFirst({
        where: { idGame: body.idGame, idUser: user.id },
      });

      if (favoriteAlreadyExists) {
        throw new Error(COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED);
      }

      await this.prisma.favorites.create({
        data: {
          idGame: body.idGame,
          gameCover: body.gameCover,
          gameDescription: body.gameDescription,
          gameName: body.gameName,
          user: { connect: { id: user.id } },
        },
      });

      const metrics = await this.updateFavoriteGamesAmount(user.id);
      return UserHelper.parseUserMetrics(metrics);
    } catch (err) {
      this.handleGameAlreadyAddedError(err);

      throw new BadRequestException('Failed to favorite game', {
        description: COLLECTIONS_RESPONSES.COLLECTION_FAVORITE_GAME_FAILED,
      });
    }
  }

  /**
   * Removes a game from the user's favorites.
   * @param body Game data to remove from favorites
   * @param user The authenticated user
   * @returns Updated user metrics
   */
  async removeGameFromFavorite(body: RemoveGameFromCollectionDto, user: User): Promise<UserMetricsResponse> {
    try {
      await this.prisma.favorites.delete({ where: { idGame_idUser: { idGame: body.idGame!, idUser: user.id } } });
      const metrics = await this.updateFavoriteGamesAmount(user.id);
      return UserHelper.parseUserMetrics(metrics);
    } catch (_) {
      throw new BadRequestException('Failed to remove game from favorite', {
        description: COLLECTIONS_RESPONSES.COLLECTION_REMOVE_GAME,
      });
    }
  }

  // ===============================
  // GAME STATUS OPERATIONS
  // ===============================

  /**
   * Removes a game from the user's status list.
   * @param body Game data to remove from status
   * @param user The authenticated user
   * @returns Updated user metrics
   */
  async removeGameFromStatus(body: RemoveGameFromCollectionDto, user: User): Promise<UserMetricsResponse> {
    try {
      await this.prisma.gameStatus.delete({ where: { idGame_idUser: { idGame: body.idGame!, idUser: user.id } } });
      return this.updateGameStatusMetrics(user);
    } catch (_) {
      throw new BadRequestException('Failed to remove game from status', {
        description: COLLECTIONS_RESPONSES.COLLECTION_REMOVE_GAME,
      });
    }
  }

  /**
   * Sets or updates a game's status for the user.
   * @param body Game status data
   * @param user The authenticated user
   * @returns Updated user metrics
   */
  async setGameStatus(body: SetGameStatusDto, user: User): Promise<UserMetricsResponse> {
    try {
      const gameAlreadySet = await this.prisma.gameStatus.findFirst({
        where: { idGame: body.idGame, status: body.status, idUser: user.id },
      });

      if (gameAlreadySet) {
        throw new Error(COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED);
      }

      await this.prisma.gameStatus.upsert({
        where: { idGame_idUser: { idGame: body.idGame, idUser: user.id } },
        update: { status: body.status },
        create: {
          idGame: body.idGame,
          idUser: user.id,
          status: body.status,
          gameName: body.gameName,
          gameCover: body.gameCover,
          gameDescription: body.gameDescription,
        },
      });

      return this.updateGameStatusMetrics(user);
    } catch (err) {
      this.handleGameAlreadyAddedError(err);

      throw new BadRequestException('Failed to set game status', {
        description: COLLECTIONS_RESPONSES.COLLECTION_SET_GAME_STATUS_FAILED,
      });
    }
  }

  // ===============================
  // COLLECTION GAMES OPERATIONS
  // ===============================

  /**
   * Adds a game to a specific collection.
   * @param collectionId Collection ID
   * @param body Game data to add
   * @param user The authenticated user
   * @returns Updated collection
   */
  async addGameToCollection(
    collectionId: number,
    body: AddGameToCollectionDto,
    user: User,
  ): Promise<CollectionResponse> {
    try {
      const gameAlreadyAdded = await this.prisma.gamesInCollections.findFirst({
        where: { idGame: body.idGame, idCollection: collectionId, idUser: user.id },
      });

      if (gameAlreadyAdded) {
        throw new Error(COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED);
      }

      await this.prisma.gamesInCollections.create({
        data: {
          idGame: body.idGame,
          gameCover: body.gameCover,
          gameDescription: body.gameDescription,
          gameName: body.gameName,
          user: { connect: { id: user.id } },
          collection: { connect: { id: collectionId } },
        },
      });

      // After adding a game, update the gamesAmount for this collection
      const collection = await this.updateCollectionGamesAmount(collectionId);
      return parseCollection(collection);
    } catch (err) {
      this.handleGameAlreadyAddedError(err);

      throw new BadRequestException('Failed to add game to collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_ADD_GAME_FAILED,
      });
    }
  }

  /**
   * Removes a game from a specific collection.
   * @param body Game and collection data
   * @param user The authenticated user
   * @returns Updated collection
   */
  async removeGameFromCollection(body: RemoveGameFromCollectionDto, user: User): Promise<CollectionResponse> {
    try {
      await this.prisma.gamesInCollections.delete({
        where: {
          idGame_idCollection_idUser: { idGame: body.idGame!, idCollection: body.idCollection!, idUser: user.id },
        },
      });

      // After removing a game, update the gamesAmount for this collection
      const collection = await this.updateCollectionGamesAmount(body.idCollection!);
      return parseCollection(collection);
    } catch (_) {
      throw new BadRequestException('Failed to remove game from collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_REMOVE_GAME,
      });
    }
  }

  // ===============================
  // ROUTER/HANDLER METHODS
  // ===============================

  /**
   * Routes game addition to the appropriate collection type handler.
   * @param body Game data with collection type
   * @param user The authenticated user
   * @returns Result from the appropriate handler
   */
  async handleAddGameToCollections(body: AddGameToCollectionDto, user: User): Promise<any> {
    switch (body.type) {
      case COLLECTION_TYPE.favorite:
        return this.favoriteGame(body, user);

      case COLLECTION_TYPE.status:
        if (!body.status) {
          throw new BadRequestException('Status is required for status collections', {
            description: COLLECTIONS_RESPONSES.COLLECTION_SET_GAME_STATUS_FAILED,
          });
        }

        return this.setGameStatus({ ...body, status: body.status }, user);

      case COLLECTION_TYPE.collection: {
        if (!body.idCollection) {
          throw new BadRequestException('Collection ID is required', {
            description: COLLECTIONS_RESPONSES.COLLECTION_ID_REQUIRED,
          });
        }

        return this.addGameToCollection(body.idCollection, body, user);
      }

      default:
        throw new BadRequestException('Invalid collection type', {
          description: COLLECTIONS_RESPONSES.COLLECTION_INVALID_TYPE,
        });
    }
  }

  /**
   * Routes game removal to the appropriate collection type handler.
   * @param body Game data with collection type
   * @param user The authenticated user
   * @returns Result from the appropriate handler
   */
  async handleRemoveGameFromCollections(body: RemoveGameFromCollectionDto, user: User): Promise<any> {
    switch (body.type) {
      case COLLECTION_TYPE.favorite:
        return this.removeGameFromFavorite(body, user);

      case COLLECTION_TYPE.status:
        return this.removeGameFromStatus(body, user);

      case COLLECTION_TYPE.collection:
      default:
        return this.removeGameFromCollection(body, user);
    }
  }

  //
  // ===============================
  // UPDATE AMOUNTS
  // ===============================
  //

  /**
   * Updates the games count for a collection.
   * @param collectionId Collection ID
   * @returns Updated collection with new amount
   */
  async updateCollectionGamesAmount(collectionId: number): Promise<Collections> {
    const amount = await this.prisma.gamesInCollections.count({
      where: { idCollection: collectionId },
    });

    return await this.prisma.collections.update({
      where: { id: collectionId },
      data: { amount },
    });
  }

  /**
   * Updates the favorite games count for a user.
   * @param userId User ID
   * @returns Updated user metrics
   */
  async updateFavoriteGamesAmount(userId: string): Promise<UserMetrics> {
    const amount = await this.prisma.favorites.count({
      where: { idUser: userId },
    });

    return await this.prisma.userMetrics.update({
      where: { idUser: userId },
      data: { favoritesAmount: amount },
    });
  }

  /**
   * Updates all game status metrics for a user (backlog, playing, paused, etc.).
   * @param user The authenticated user
   * @returns Updated user metrics
   */
  async updateGameStatusMetrics(user: User): Promise<UserMetricsResponse> {
    const statusCounts = await this.prisma.gameStatus.groupBy({
      by: ['status'],
      where: { idUser: user.id },
      _count: { status: true },
    });

    // Prepare an update object for userMetrics
    const metricsUpdate: Record<string, number> = {};
    // Create a mapping from status to userMetrics field for easier maintainability
    const statusFieldMap: Record<GameStatusEnum, string> = {
      backlog: 'backlogAmount',
      playing: 'playingAmount',
      paused: 'pausedAmount',
      finished: 'finishedAmount',
      wishlist: 'wishlistAmount',
      dropped: 'droppedAmount',
    };

    for (const statusCount of statusCounts) {
      const field = statusFieldMap[statusCount.status];
      if (field) metricsUpdate[field] = statusCount._count.status;
    }

    // If userMetrics fields for game status amounts are always present and default 0, fill missing statuses
    const allStatuses = ['backlog', 'playing', 'paused', 'finished', 'wishlist', 'dropped'];
    for (const s of allStatuses) {
      const field = statusFieldMap[s] ?? null;

      if (field && !(field in metricsUpdate)) {
        metricsUpdate[field] = 0;
      }
    }

    const metrics = await this.prisma.userMetrics.update({
      where: { idUser: user.id },
      data: metricsUpdate,
    });

    return UserHelper.parseUserMetrics(metrics);
  }

  //
  // ===============================
  // GET LISTS
  // ===============================
  //

  /**
   * Retrieves a paginated list of games from a specific collection.
   * @param collectionId Collection ID
   * @param page Page number
   * @param limit Items per page
   * @param user The authenticated user
   * @returns Paginated list of games in the collection
   */
  async getGamesFromCollectionList(
    collectionId: number,
    page: number,
    limit: number,
    user: User,
  ): Promise<PaginatedResponse<GameInCollectionListResponse>> {
    try {
      // Verify the collection exists and belongs to the user
      const collection = await this.prisma.collections.findFirst({
        where: { id: collectionId, idUser: user.id },
      });

      if (!collection) {
        throw new BadRequestException('Collection not found', {
          description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
        });
      }

      const skip = (page - 1) * limit;

      // Get games with pagination
      const [games, total] = await Promise.all([
        this.prisma.gamesInCollections.findMany({
          where: { idCollection: collectionId, idUser: user.id },
          skip,
          take: limit,
          orderBy: { createDate: 'desc' },
        }),
        this.prisma.gamesInCollections.count({
          where: { idCollection: collectionId, idUser: user.id },
        }),
      ]);

      // Transform games to response format (remove idCollection and idUser)
      const gamesResponse: GameInCollectionListResponse[] = games.map((game) => {
        const { idCollection: _idCollection, idUser: _idUser, ...rest } = game;
        return rest as GameInCollectionListResponse;
      });

      return createPaginatedResponse<GameInCollectionListResponse>(gamesResponse, page, limit, total);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException('Failed to get games from collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }

  /**
   * Retrieves a paginated list of favorite games for the user.
   * @param page Page number
   * @param limit Items per page
   * @param user The authenticated user
   * @returns Paginated list of favorite games
   */
  async getFavoriteGamesList(
    page: number,
    limit: number,
    user: User,
  ): Promise<PaginatedResponse<FavoriteGameListResponse>> {
    try {
      const skip = (page - 1) * limit;

      // Get games with pagination
      const [games, total] = await Promise.all([
        this.prisma.favorites.findMany({
          where: { idUser: user.id },
          skip,
          take: limit,
          orderBy: { createDate: 'desc' },
        }),
        this.prisma.favorites.count({ where: { idUser: user.id } }),
      ]);

      // Transform games to response format (remove id and idUser)
      const gamesResponse: FavoriteGameListResponse[] = games.map((game) => {
        const { id: _id, idUser: _idUser, ...rest } = game;
        return rest as FavoriteGameListResponse;
      });

      return createPaginatedResponse<FavoriteGameListResponse>(gamesResponse, page, limit, total);
    } catch (_) {
      throw new BadRequestException('Failed to get favorite games', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }

  /**
   * Retrieves a paginated list of games with a specific status for the user.
   * @param status Game status to filter by
   * @param page Page number
   * @param limit Items per page
   * @param user The authenticated user
   * @returns Paginated list of games with the specified status
   */
  async getStatusGamesList(
    status: GameStatusEnum,
    page: number,
    limit: number,
    user: User,
  ): Promise<PaginatedResponse<GameStatusListResponse>> {
    try {
      const skip = (page - 1) * limit;

      // Get games with pagination
      const [games, total] = await Promise.all([
        this.prisma.gameStatus.findMany({
          where: { status, idUser: user.id },
          skip,
          take: limit,
          orderBy: { createDate: 'desc' },
        }),
        this.prisma.gameStatus.count({ where: { status, idUser: user.id } }),
      ]);

      // Transform games to response format (remove idCollection and idUser)
      const gamesResponse: GameStatusListResponse[] = games.map((game) => {
        const { id: _id, idUser: _idUser, ...rest } = game;
        return rest as GameStatusListResponse;
      });

      return createPaginatedResponse<GameStatusListResponse>(gamesResponse, page, limit, total);
    } catch (_) {
      throw new BadRequestException('Failed to get status games', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }
}
