import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from 'src/album/entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
