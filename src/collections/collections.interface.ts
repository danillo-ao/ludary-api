import { Collections } from '@prisma/client';

export interface CollectionResponse extends Omit<Collections, 'icon' | 'color'> {
  icon: number;
  color: number;
}
