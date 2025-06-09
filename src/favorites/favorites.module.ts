import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorites.entity';
import { FavoritesController } from 'src/favorites/favorites.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Track } from 'src/track/entities/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Artist, // Add this
      Album, // Add this
      Track, // Add this
      Favorites, // Already present
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
