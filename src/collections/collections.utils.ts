import { Collections } from '@prisma/client';
import { CollectionResponse } from './collections.interface';

export const parseCollection = (collection: Collections): CollectionResponse => {
  return {
    ...collection,
    color: parseInt(collection.color.toString()),
    icon: parseInt(collection.icon.toString()),
  };
};
