import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from 'src/favorites/entities/favorites.entity';
import { FavoritesController } from 'src/favorites/favorites.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
