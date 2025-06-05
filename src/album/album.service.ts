import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { AlbumResponseDto } from 'src/album/dto/album-response.dto';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { ARTIST_DELETE_EVENT } from 'src/artist/artist.service';
import {
  AlbumNotFoundException,
  MissingFieldsException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

export const ALBUM_DELETE_EVENT = 'album.delete' as const;

@Injectable()
export class AlbumService {
  emitter: EventEmitter2;

  constructor(
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    emitter: EventEmitter2,
  ) {
    this.emitter = emitter;
  }
  async create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || createAlbumDto.year === undefined) {
      throw MissingFieldsException();
    }
    const album = new Album();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = createAlbumDto.artistId;
    album.id = uuid();

    await this.albumRepo.save(album);

    return plainToInstance(AlbumResponseDto, album);
  }

  async findAll(): Promise<Album[]> {
    return plainToInstance(AlbumResponseDto, await this.albumRepo.find());
  }

  async findOne(id: string) {
    uuidValidator(id);
    const album = await this.albumRepo.findOneBy({ id });

    if (!album) {
      throw AlbumNotFoundException();
    }

    return plainToInstance(AlbumResponseDto, album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (
      updateAlbumDto.name === undefined ||
      updateAlbumDto.year === undefined
    ) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const album = await this.albumRepo.findOneBy({ id });

    if (!album) {
      throw AlbumNotFoundException();
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    await this.albumRepo.save(album);
    return plainToInstance(AlbumResponseDto, album);
  }

  async remove(id: string) {
    uuidValidator(id);
    const album = await this.albumRepo.findOneBy({ id });
    if (!album) {
      throw AlbumNotFoundException();
    }
    this.emitter.emit(ALBUM_DELETE_EVENT, id);
    await this.albumRepo.delete(id);
  }

  @OnEvent(ARTIST_DELETE_EVENT)
  async onArtistDelete(artistId: string) {
    await this.albumRepo.update({ artistId }, { artistId: null });
  }
}
