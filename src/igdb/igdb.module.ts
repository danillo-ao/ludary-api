import { Global, Module } from '@nestjs/common';
import { IgdbService } from './igdb.service';

@Global()
@Module({
  providers: [IgdbService],
  exports: [IgdbService],
})
export class IgdbModule {}
