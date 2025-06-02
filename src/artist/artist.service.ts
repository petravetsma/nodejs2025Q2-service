import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { ArtistResponseDto } from 'src/artist/dto/artist-response.dto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { Artist } from 'src/artist/entities/artist.entity';
import { db } from 'src/common/db';
import {
  ArtistNotFoundException,
  MissingFieldsException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { v4 as uuid } from 'uuid';

export const ARTIST_DELETE_EVENT = 'artist.delete' as const;
@Injectable()
export class ArtistService {
  emitter: EventEmitter2;

  constructor(emitter: EventEmitter2) {
    this.emitter = emitter;
  }

  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw MissingFieldsException();
    }
    const artist = new Artist();
    artist.name = createArtistDto.name;
    artist.grammy = createArtistDto.grammy;
    artist.id = uuid();

    db.artists.push(artist);

    return plainToInstance(ArtistResponseDto, artist);
  }

  findAll(): Artist[] {
    return plainToInstance(ArtistResponseDto, db.artists);
  }

  findOne(id: string) {
    uuidValidator(id);
    const artist = db.artists.filter((artist: Artist) => artist.id === id)[0];

    if (!artist) {
      throw ArtistNotFoundException();
    }

    return plainToInstance(ArtistResponseDto, artist);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      updateArtistDto.name === undefined ||
      updateArtistDto.grammy === undefined
    ) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const artistId = db.artists.findIndex((artist) => artist.id === id);

    if (artistId === -1) {
      throw ArtistNotFoundException();
    }

    const artist: Artist = db.artists[artistId];

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return plainToInstance(ArtistResponseDto, artist);
  }

  remove(id: string) {
    uuidValidator(id);
    const artistId = db.artists.findIndex((artist) => artist.id === id);
    if (artistId === -1) {
      throw ArtistNotFoundException();
    }
    this.emitter.emit(ARTIST_DELETE_EVENT, id);
    db.artists = db.artists.filter((artist) => artist.id !== id);
  }
}
