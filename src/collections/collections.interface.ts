import { Collections, Favorites, GamesInCollections, GameStatus } from '@prisma/client';

export interface CollectionResponse extends Omit<Collections, 'icon' | 'color'> {
  icon: number;
  color: number;
}

export type GameInCollectionListResponse = Omit<GamesInCollections, 'idCollection' | 'idUser'>;

export type FavoriteGameListResponse = Omit<Favorites, 'id' | 'idUser'>;

export type GameStatusListResponse = Omit<GameStatus, 'id' | 'idUser'>;
