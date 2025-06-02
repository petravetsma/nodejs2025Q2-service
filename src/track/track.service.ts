import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { ALBUM_DELETE_EVENT } from 'src/album/album.service';
import { ARTIST_DELETE_EVENT } from 'src/artist/artist.service';
import { db } from 'src/common/db';
import {
  MissingFieldsException,
  TrackNotFoundException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { TrackResponseDto } from 'src/track/dto/track-response.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { Track } from 'src/track/entities/track.entity';
import { v4 as uuid } from 'uuid';

export const TRACK_DELETE_EVENT = 'track.delete' as const;

@Injectable()
export class TrackService {
  emitter: EventEmitter2;

  constructor(emitter: EventEmitter2) {
    this.emitter = emitter;
  }
  create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || createTrackDto.duration === undefined) {
      throw MissingFieldsException();
    }
    const track = new Track();
    track.name = createTrackDto.name;
    track.duration = createTrackDto.duration;
    track.id = uuid();
    track.albumId = createTrackDto.albumId;
    track.artistId = createTrackDto.artistId;

    db.tracks.push(track);

    return plainToInstance(TrackResponseDto, track);
  }

  findAll(): Track[] {
    return plainToInstance(TrackResponseDto, db.tracks);
  }

  findOne(id: string) {
    uuidValidator(id);
    const track = db.tracks.filter((track: Track) => track.id === id)[0];

    if (!track) {
      throw TrackNotFoundException();
    }

    return plainToInstance(TrackResponseDto, track);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto.name || updateTrackDto.duration === undefined) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const trackId = db.tracks.findIndex((track) => track.id === id);

    if (trackId === -1) {
      throw TrackNotFoundException();
    }

    const track: Track = db.tracks[trackId];

    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;

    if (updateTrackDto.albumId) {
      track.albumId = updateTrackDto.albumId;
    }

    if (updateTrackDto.artistId) {
      track.artistId = updateTrackDto.artistId;
    }

    return plainToInstance(TrackResponseDto, track);
  }

  remove(id: string) {
    uuidValidator(id);
    const trackId = db.tracks.findIndex((track) => track.id === id);
    if (trackId === -1) {
      throw TrackNotFoundException();
    }
    this.emitter.emit(TRACK_DELETE_EVENT);
    db.tracks = db.tracks.filter((track) => track.id !== id);
  }

  @OnEvent(ARTIST_DELETE_EVENT)
  onArtistDelete(artistId: string) {
    db.tracks.forEach((track: Track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  @OnEvent(ALBUM_DELETE_EVENT)
  onAlbumDelete(albumId: string) {
    db.tracks.forEach((track: Track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
