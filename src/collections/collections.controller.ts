import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { UserDecorator } from 'src/auth/auth.decorator';
import { User } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from 'src/auth/auth.guard';
import { CollectionDto, AddGameToCollectionDto } from './collections.dto';
import { CollectionResponse, FavoriteGameListResponse, GameInCollectionListResponse } from './collections.interface';
import { PaginationQueryDto } from 'src/utils/pagination/pagination.dto';
import { PaginatedResponse } from 'src/utils/pagination/pagination.interface';
import { GameStatusEnum } from '@prisma/client';

@Controller('collections')
export class CollectionsController {
  @Inject(CollectionsService)
  private readonly collectionsService: CollectionsService;

  @Post('create')
  @UseGuards(SupabaseAuthGuard)
  createCollection(@UserDecorator() user: User, @Body() body: CollectionDto): Promise<CollectionResponse> {
    return this.collectionsService.createCollection(body, user);
  }

  @Put('update/:id')
  @UseGuards(SupabaseAuthGuard)
  updateCollection(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() body: CollectionDto,
  ): Promise<CollectionResponse> {
    return this.collectionsService.updateCollection(id, body, user);
  }

  @Get('/list/collection/:id')
  @UseGuards(SupabaseAuthGuard)
  getGamesFromCollection(
    @UserDecorator() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<GameInCollectionListResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.collectionsService.getGamesFromCollectionList(id, page, limit, user);
  }

  @Get('/list/favorites')
  @UseGuards(SupabaseAuthGuard)
  getFavoriteGames(
    @UserDecorator() user: User,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<FavoriteGameListResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.collectionsService.getFavoriteGamesList(page, limit, user);
  }

  @Get('/list/status/:status')
  @UseGuards(SupabaseAuthGuard)
  getStatusGames(
    @UserDecorator() user: User,
    @Param('status', new ParseEnumPipe(GameStatusEnum)) status: GameStatusEnum,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponse<FavoriteGameListResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.collectionsService.getStatusGamesList(status, page, limit, user);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  getCollections(@UserDecorator() user: User): Promise<CollectionResponse[]> {
    return this.collectionsService.getCollections(user);
  }

  @Delete('delete/:id')
  @UseGuards(SupabaseAuthGuard)
  deleteCollection(@UserDecorator() user: User, @Param('id') id: number): Promise<void> {
    return this.collectionsService.deleteCollection(id, user);
  }

  @Post('game')
  @UseGuards(SupabaseAuthGuard)
  addGameToCollection(@UserDecorator() user: User, @Body() body: AddGameToCollectionDto): Promise<void> {
    return this.collectionsService.handleAddGameToCollections(body, user);
  }
}
