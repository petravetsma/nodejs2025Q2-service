import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { db } from 'src/common/db';
import {
  InvalidUUIDException,
  MissingFieldsException,
  AlbumNotFoundException,
} from 'src/common/exception';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { AlbumResponseDto } from 'src/album/dto/album-response.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { v4 as uuid, validate } from 'uuid';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ARTIST_DELETE_EVENT } from 'src/artist/artist.service';

export const ALBUM_DELETE_EVENT = 'album.delete' as const;

@Injectable()
export class AlbumService {
  emitter: EventEmitter2;

  constructor(emitter: EventEmitter2) {
    this.emitter = emitter;
  }
  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || createAlbumDto.year === undefined) {
      throw MissingFieldsException();
    }
    const album = new Album();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = createAlbumDto.artistId;
    album.id = uuid();

    db.albums.push(album);

    return plainToInstance(AlbumResponseDto, album);
  }

  findAll(): Album[] {
    return plainToInstance(AlbumResponseDto, db.albums);
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const album = db.albums.filter((album: Album) => album.id === id)[0];

    if (!album) {
      throw AlbumNotFoundException();
    }

    return plainToInstance(AlbumResponseDto, album);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (
      updateAlbumDto.name === undefined ||
      updateAlbumDto.year === undefined
    ) {
      throw MissingFieldsException();
    }

    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const albumId = db.albums.findIndex((album) => album.id === id);

    if (albumId === -1) {
      throw AlbumNotFoundException();
    }

    const album: Album = db.albums[albumId];

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return plainToInstance(AlbumResponseDto, album);
  }

  remove(id: string) {
    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const albumId = db.albums.findIndex((album) => album.id === id);
    if (albumId === -1) {
      throw AlbumNotFoundException();
    }
    this.emitter.emit(ALBUM_DELETE_EVENT, id);
    db.albums = db.albums.filter((album) => album.id !== id);
  }

  @OnEvent(ARTIST_DELETE_EVENT)
  onArtistDelete(artistId: string) {
    db.albums.forEach((album: Album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
