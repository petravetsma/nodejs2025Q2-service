import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ALBUM_DELETE_EVENT } from 'src/album/album.service';
import { ARTIST_DELETE_EVENT } from 'src/artist/artist.service';
import {
  MissingFieldsException,
  TrackNotFoundException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { TrackResponseDto } from 'src/track/dto/track-response.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { Track } from 'src/track/entities/track.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

export const TRACK_DELETE_EVENT = 'track.delete' as const;

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
    emitter: EventEmitter2,
  ) {
    this.emitter = emitter;
  }
  emitter: EventEmitter2;

  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || createTrackDto.duration === undefined) {
      throw MissingFieldsException();
    }
    const track = new Track();
    track.name = createTrackDto.name;
    track.duration = createTrackDto.duration;
    track.id = uuid();
    track.albumId = createTrackDto.albumId;
    track.artistId = createTrackDto.artistId;

    await this.trackRepo.save(track);

    return plainToInstance(TrackResponseDto, track);
  }

  async findAll(): Promise<TrackResponseDto[]> {
    return plainToInstance(TrackResponseDto, await this.trackRepo.find());
  }

  async findOne(id: string) {
    uuidValidator(id);
    const track = await this.trackRepo.findOneBy({ id });

    if (!track) {
      throw TrackNotFoundException();
    }

    return plainToInstance(TrackResponseDto, track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto.name || updateTrackDto.duration === undefined) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const track = await this.trackRepo.findOneBy({ id });

    if (!track) {
      throw TrackNotFoundException();
    }

    track.name = updateTrackDto.name;
    track.duration = updateTrackDto.duration;

    track.albumId = updateTrackDto.albumId ?? track.albumId;
    track.artistId = updateTrackDto.artistId ?? track.artistId;

    await this.trackRepo.save(track);
    return plainToInstance(TrackResponseDto, track);
  }

  async remove(id: string) {
    uuidValidator(id);
    const track = await this.trackRepo.findOneBy({ id });
    if (!track) {
      throw TrackNotFoundException();
    }
    this.emitter.emit(TRACK_DELETE_EVENT, id);
    await this.trackRepo.delete(id);
  }

  @OnEvent(ARTIST_DELETE_EVENT)
  async onArtistDelete(artistId: string) {
    // Update all tracks with matching artistId
    await this.trackRepo.update({ artistId }, { artistId: null });
  }

  @OnEvent(ALBUM_DELETE_EVENT)
  async onAlbumDelete(albumId: string) {
    // Update all tracks with matching albumId
    await this.trackRepo.update({ albumId }, { albumId: null });
  }
}
