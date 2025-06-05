import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ArtistResponseDto } from 'src/artist/dto/artist-response.dto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { Artist } from 'src/artist/entities/artist.entity';
import {
  ArtistNotFoundException,
  MissingFieldsException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

export const ARTIST_DELETE_EVENT = 'artist.delete' as const;
@Injectable()
export class ArtistService {
  emitter: EventEmitter2;

  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    emitter: EventEmitter2,
  ) {
    this.emitter = emitter;
  }

  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw MissingFieldsException();
    }
    const artist = new Artist();
    artist.name = createArtistDto.name;
    artist.grammy = createArtistDto.grammy;
    artist.id = uuid();

    await this.artistRepo.save(artist);

    return plainToInstance(ArtistResponseDto, artist);
  }

  async findAll(): Promise<ArtistResponseDto[]> {
    return plainToInstance(ArtistResponseDto, await this.artistRepo.find());
  }

  async findOne(id: string) {
    uuidValidator(id);
    const artist = await this.artistRepo.findOneBy({ id });

    if (!artist) {
      throw ArtistNotFoundException();
    }

    return plainToInstance(ArtistResponseDto, artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      updateArtistDto.name === undefined ||
      updateArtistDto.grammy === undefined
    ) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const artist = await this.artistRepo.findOneBy({ id });

    if (!artist) {
      throw ArtistNotFoundException();
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    await this.artistRepo.save(artist);
    return plainToInstance(ArtistResponseDto, artist);
  }

  async remove(id: string) {
    uuidValidator(id);
    const artist = await this.artistRepo.findOneBy({ id });
    if (!artist) {
      throw ArtistNotFoundException();
    }
    this.emitter.emit(ARTIST_DELETE_EVENT, id);
    await this.artistRepo.delete(id);
  }
}
