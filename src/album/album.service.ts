import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { AlbumResponseDto } from 'src/album/dto/album-response.dto';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import {
  AlbumNotFoundException,
  MissingFieldsException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}
  async create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || createAlbumDto.year === undefined) {
      throw MissingFieldsException();
    }

    const artist = createAlbumDto.artistId
      ? await this.artistRepo.findOne({
          where: { id: createAlbumDto.artistId },
        })
      : null;
    const album = new Album();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artist = artist;
    album.id = uuid();

    await this.albumRepo.save(album);

    return plainToInstance(AlbumResponseDto, album);
  }

  async findAll(): Promise<AlbumResponseDto[]> {
    const albums = await this.albumRepo.find({ relations: ['artist'] });
    return plainToInstance(AlbumResponseDto, albums);
  }

  async findOne(id: string) {
    uuidValidator(id);
    const album = await this.albumRepo.findOne({
      where: { id },
      relations: ['artist'], // Load relation
    });

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

    const artist = updateAlbumDto.artistId
      ? await this.artistRepo.findOne({
          where: { id: updateAlbumDto.artistId },
        })
      : null;
    album.artist = artist;

    await this.albumRepo.save(album);
    return plainToInstance(AlbumResponseDto, album);
  }

  async remove(id: string) {
    uuidValidator(id);
    const album = await this.albumRepo.findOneBy({ id });
    if (!album) {
      throw AlbumNotFoundException();
    }
    await this.albumRepo.delete(id);
  }

  // public toAlbumResponseDto(album: Album): AlbumResponseDto {
  //   return plainToInstance(AlbumResponseDto, {
  //     id: album.id,
  //     name: album.name,
  //     year: album.year,
  //     artistId: album.artist ? album.artist.id : null, // Safe access
  //   });
  // }
}
