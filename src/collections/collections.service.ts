import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionDto } from './collections.dto';
import { User } from '@supabase/supabase-js';
import { COLLECTIONS_RESPONSES } from './collections.constants';
import { CollectionResponse } from './collections.interface';

@Injectable()
export class CollectionsService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

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

      return {
        ...collection,
        icon: parseInt(collection.icon.toString()),
        color: parseInt(collection.color.toString()),
      };
    } catch (_) {
      throw new BadRequestException('Failed to create collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_CREATE_FAILED,
      });
    }
  }

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

      return {
        ...collection,
        icon: parseInt(collection.icon.toString()),
        color: parseInt(collection.color.toString()),
      };
    } catch (_) {
      throw new BadRequestException('Failed to update collection', {
        description: COLLECTIONS_RESPONSES.COLLECTION_UPDATE_FAILED,
      });
    }
  }

  async getCollections(user: User): Promise<CollectionResponse[]> {
    try {
      const collections = await this.prisma.collections.findMany({ where: { idUser: user.id } });

      return collections.map((collection) => ({
        ...collection,
        icon: parseInt(collection.icon.toString()),
        color: parseInt(collection.color.toString()),
      }));
    } catch (_) {
      throw new BadRequestException('Failed to get collections', {
        description: COLLECTIONS_RESPONSES.COLLECTION_GET_FAILED,
      });
    }
  }
}
