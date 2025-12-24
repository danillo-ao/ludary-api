import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { UserDecorator } from 'src/auth/auth.decorator';
import { User } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from 'src/auth/auth.guard';
import { CollectionDto, AddGameToCollectionDto } from './collections.dto';
import { CollectionResponse } from './collections.interface';

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

  @Post(':id/game')
  @UseGuards(SupabaseAuthGuard)
  addGameToCollection(
    @UserDecorator() user: User,
    @Param('id') id: number,
    @Body() body: AddGameToCollectionDto,
  ): Promise<void> {
    return this.collectionsService.handleAddGameToCollections(id, body, user);
  }
}
