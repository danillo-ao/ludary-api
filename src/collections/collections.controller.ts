import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { UserDecorator } from 'src/auth/auth.decorator';
import { User } from '@supabase/supabase-js';
import { SupabaseAuthGuard } from 'src/auth/auth.guard';
import { CollectionDto } from './collections.dto';
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
}
