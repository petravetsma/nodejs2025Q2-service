import { Module } from '@nestjs/common';
import { FavoritesController } from 'src/favorites/favorites.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
