import { GameStatusEnum } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  icon: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  color: number;

  @IsBoolean()
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  public: boolean;
}

export enum COLLECTION_TYPE {
  favorite = 'favorite',
  status = 'status',
  collection = 'collection',
}

export class GameToCollectionDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  idGame: number;

  @IsString()
  @IsOptional()
  gameCover?: string;

  @IsString()
  @IsOptional()
  gameDescription: string;

  @IsString()
  @IsNotEmpty()
  gameName: string;
}

export class FavoriteGameDto extends GameToCollectionDto {}

export class SetGameStatusDto extends GameToCollectionDto {
  @IsEnum(GameStatusEnum)
  @IsNotEmpty()
  status: GameStatusEnum;
}

export class AddGameToCollectionDto extends GameToCollectionDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(String(value), 10))
  idCollection?: number;

  @IsEnum(COLLECTION_TYPE)
  @IsNotEmpty()
  type: COLLECTION_TYPE;

  @IsEnum(GameStatusEnum)
  @IsOptional()
  status?: GameStatusEnum;
}
