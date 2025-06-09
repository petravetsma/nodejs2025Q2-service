import { AlbumResponseDto } from './../album/dto/album-response.dto';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Favorites } from 'src/favorites/entities/favorites.entity';
import {
  AlbumNotFoundException,
  ArtistNotFoundException,
  TrackNotFoundException,
  UnprocessableArtistException,
  UnprocessableAlbumException,
  UnprocessableTrackException,
} from 'src/common/exception';
import { uuidValidator } from 'src/common/thrower';
import { FavoritesResponseDto } from 'src/favorites/dto/favorites-response.dto';
import { ArtistResponseDto } from 'src/artist/dto/artist-response.dto';
import { TrackResponseDto } from 'src/track/dto/track-response.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
    @InjectRepository(Favorites)
    private readonly favsRepo: Repository<Favorites>,
  ) {}

  async getOrCreateFavorites(): Promise<Favorites> {
    let favorites = await this.favsRepo.findOne({
      where: { id: 'default' },
      relations: [
        'artists',
        'albums',
        'albums.artist',
        'tracks',
        'tracks.artist',
        'tracks.album',
      ],
    });
    if (!favorites) {
      favorites = this.favsRepo.create({
        id: 'default',
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favsRepo.save(favorites);
    }
    return favorites!;
  }

  async findAll(): Promise<FavoritesResponseDto> {
    const favorites = await this.getOrCreateFavorites();

    return {
      artists: plainToInstance(ArtistResponseDto, favorites?.artists || []),
      albums: plainToInstance(AlbumResponseDto, favorites?.albums) || [],
      tracks: plainToInstance(TrackResponseDto, favorites?.tracks || []),
    };
  }

  async addArtistToFavorites(artistId: string) {
    uuidValidator(artistId);

    const artist = await this.artistRepo.findOneBy({ id: artistId });
    if (!artist) {
      throw UnprocessableArtistException();
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites?.artists.some((a) => a.id === artistId)) {
      favorites?.artists.push(artist);
      await this.favsRepo.save(favorites);
    }
    return artistId;
  }

  async removeArtistFromFavorites(artistId: string) {
    uuidValidator(artistId);

    const favorites = await this.getOrCreateFavorites();
    const initialCount = favorites?.artists.length;

    favorites.artists = favorites.artists.filter((a) => a.id !== artistId);

    if (favorites.artists.length === initialCount) {
      throw ArtistNotFoundException();
    }

    await this.favsRepo.save(favorites);
  }

  async addAlbumToFavorites(albumId: string) {
    uuidValidator(albumId);

    const album = await this.albumRepo.findOne({
      where: { id: albumId },
      relations: ['artist'],
    });
    if (!album) {
      throw UnprocessableAlbumException();
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.albums.some((a) => a.id === albumId)) {
      favorites.albums.push(album);
      await this.favsRepo.save(favorites);
    }
    return albumId;
  }

  async removeAlbumFromFavorites(albumId: string) {
    uuidValidator(albumId);

    const favorites = await this.getOrCreateFavorites();
    const initialCount = favorites.albums.length;

    favorites.albums = favorites.albums.filter((a) => a.id !== albumId);

    if (favorites.albums.length === initialCount) {
      throw AlbumNotFoundException();
    }

    await this.favsRepo.save(favorites);
  }

  async addTrackToFavorites(trackId: string) {
    uuidValidator(trackId);

    const track = await this.trackRepo.findOneBy({ id: trackId });
    if (!track) {
      throw UnprocessableTrackException();
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.tracks.some((t) => t.id === trackId)) {
      favorites.tracks.push(track);
      await this.favsRepo.save(favorites);
    }
    return trackId;
  }

  async removeTrackFromFavorites(trackId: string) {
    uuidValidator(trackId);

    const favorites = await this.getOrCreateFavorites();
    const initialCount = favorites.tracks.length;

    favorites.tracks = favorites.tracks.filter((t) => t.id !== trackId);

    if (favorites.tracks.length === initialCount) {
      throw TrackNotFoundException();
    }

    await this.favsRepo.save(favorites);
  }
}
