import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddGameToCollectionDto,
  COLLECTION_TYPE,
  CollectionDto,
  FavoriteGameDto,
  SetGameStatusDto,
} from './collections.dto';
import { User } from '@supabase/supabase-js';
import { COLLECTIONS_RESPONSES } from './collections.constants';
import { CollectionResponse } from './collections.interface';
import { GameStatusEnum } from '@prisma/client';
import { parseCollection } from './collections.utils';
import { UserHelper } from 'src/user/user.helper';
import { UserMetricsResponse } from 'src/user/user.interfaces';

@Injectable()
export class CollectionsService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  /**
   *
   * @param body
   * @param user
   * @returns
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
   *
   * @param id
   * @param body
   * @param user
   * @returns
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
   *
   * @param user
   * @returns
   */
  async getCollections(user: User): Promise<CollectionResponse[]> {
    try {
      const collections = await this.prisma.collections.findMany({ where: { idUser: user.id } });

      return collections.map(parseCollection);
    } catch (_) {
      throw new BadRequestException('Failed to get collections', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }

  /**
   *
   * @param id
   * @param user
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

  /**
   *
   * @param body
   * @param user
   * @returns
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

      const metrics = await this.prisma.userMetrics.update({
        where: { idUser: user.id },
        data: { favoritesAmount: { increment: 1 } },
      });

      return UserHelper.parseUserMetrics(metrics);
    } catch (err) {
      if (err instanceof Error && err.message === COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED) {
        throw new BadRequestException('Game already added to collection', {
          description: COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED,
        });
      }

      throw new BadRequestException('Failed to favorite game', {
        description: COLLECTIONS_RESPONSES.COLLECTION_FAVORITE_GAME_FAILED,
      });
    }
  }

  /**
   *
   * @param user
   * @returns
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

  /**
   *
   * @param body
   * @param user
   * @returns
   */
  async setGameStatus(body: SetGameStatusDto, user: User): Promise<UserMetricsResponse> {
    try {
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
    } catch (_) {
      throw new BadRequestException('Failed to set game status', {
        description: COLLECTIONS_RESPONSES.COLLECTION_SET_GAME_STATUS_FAILED,
      });
    }
  }

  /**
   *
   * @param collectionId
   * @param body
   * @param user
   * @returns
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
      const collection = await this.prisma.collections.update({
        where: { id: collectionId },
        data: { amount: { increment: 1 } },
      });

      return parseCollection(collection);
    } catch (err) {
      if (err instanceof Error && err.message === COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED) {
        throw new BadRequestException('Game already added to collection', {
          description: COLLECTIONS_RESPONSES.COLLECTION_GAME_ALREADY_ADDED,
        });
      }

      throw new BadRequestException('Failed to add game to collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_ADD_GAME_FAILED,
      });
    }
  }

  /**
   *
   * @param id
   * @param body
   * @param user
   * @returns
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
}
