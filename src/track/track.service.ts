import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
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
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || createTrackDto.duration === undefined) {
      throw MissingFieldsException();
    }

    const artist = createTrackDto.artistId
      ? await this.artistRepo.findOne({
          where: { id: createTrackDto.artistId },
        })
      : null;

    const album = createTrackDto.albumId
      ? await this.albumRepo.findOne({ where: { id: createTrackDto.albumId } })
      : null;

    const track = new Track();
    track.name = createTrackDto.name;
    track.duration = createTrackDto.duration;
    track.id = uuid();
    track.album = album;
    track.artist = artist;

    await this.trackRepo.save(track);

    return plainToInstance(TrackResponseDto, track);
  }

  async findAll(): Promise<TrackResponseDto[]> {
    const tracks = await this.trackRepo.find();
    return plainToInstance(TrackResponseDto, tracks);
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

    const album = updateTrackDto.albumId
      ? await this.albumRepo.findOne({ where: { id: updateTrackDto.albumId } })
      : null;

    track.album = album;
    const artist = updateTrackDto.artistId
      ? await this.artistRepo.findOne({
          where: { id: updateTrackDto.artistId },
        })
      : null;
    track.artist = artist;

    await this.trackRepo.save(track);
    return plainToInstance(TrackResponseDto, track);
  }

  async remove(id: string) {
    uuidValidator(id);
    const track = await this.trackRepo.findOneBy({ id });
    if (!track) {
      throw TrackNotFoundException();
    }
    await this.trackRepo.delete(id);
  }

  // public toTrackResponseDto(track: Track): TrackResponseDto {
  //   return plainToInstance(TrackResponseDto, {
  //     ...track,
  //     artistId: track.artist?.id ?? null,
  //     albumId: track.album?.id ?? null,
  //   });
  // }
}
