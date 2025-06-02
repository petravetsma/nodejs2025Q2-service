import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ALBUM_DELETE_EVENT } from 'src/album/album.service';
import { ARTIST_DELETE_EVENT } from 'src/artist/artist.service';
import { db } from 'src/common/db';
import {
  AlbumNotFoundException,
  ArtistNotFoundException,
  InvalidUUIDException,
  TrackNotFoundException,
  UnprocessableArtistException,
  UnprocessableTrackException,
} from 'src/common/exception';
import { FavoritesResponseDto } from 'src/favorites/dto/favorites-response.dto';
import { TRACK_DELETE_EVENT } from 'src/track/track.service';
import { validate } from 'uuid';

export const FavoritesDeleteEvent = 'favorites.delete' as const;

@Injectable()
export class FavoritesService {
  emitter: EventEmitter2;

  constructor(emitter: EventEmitter2) {
    this.emitter = emitter;
  }

  findAll(): FavoritesResponseDto {
    return {
      artists: db.artists.filter((artist) =>
        db.favorites.artists.has(artist.id),
      ),
      albums: db.albums.filter((album) => db.favorites.albums.has(album.id)),
      tracks: db.tracks.filter((track) => db.favorites.tracks.has(track.id)),
    };
  }

  addTrackToFavorites(trackId: string) {
    if (!validate(trackId)) {
      throw InvalidUUIDException();
    }

    const trackIndex = db.tracks.findIndex((track) => track.id === trackId);

    if (trackIndex === -1) {
      throw UnprocessableTrackException();
    }
    db.favorites.tracks.add(trackId);
    return trackId;
  }

  removeTrackFromFavorites(trackId: string) {
    if (!validate(trackId)) {
      throw InvalidUUIDException();
    }
    console.log(db.favorites.tracks, 'tracks', trackId);
    if (!db.favorites.tracks.has(trackId)) {
      throw TrackNotFoundException();
    }
    const trackIndex = db.tracks.findIndex((track) => track.id === trackId);
    if (trackIndex !== -1) {
      db.favorites.tracks.delete(trackId);
      return;
    }
    throw new InternalServerErrorException(
      'Track is in favorites but not in tracks',
    );
  }

  addArtistToFavorites(artistId: string) {
    if (!validate(artistId)) {
      throw InvalidUUIDException();
    }
    const artistIndex = db.artists.findIndex(
      (artist) => artist.id === artistId,
    );

    if (artistIndex === -1) {
      throw UnprocessableArtistException();
    }
    db.favorites.artists.add(artistId);
    return artistId;
  }

  removeArtistFromFavorites(artistId: string) {
    if (!validate(artistId)) {
      throw InvalidUUIDException();
    }
    if (!db.favorites.artists.has(artistId)) {
      throw ArtistNotFoundException();
    }
    const artistIndex = db.artists.findIndex(
      (artist) => artist.id === artistId,
    );
    if (artistIndex !== -1) {
      db.favorites.artists.delete(artistId);
      return;
    }

    throw new InternalServerErrorException(
      'Track is in favorites but not in tracks',
    );
  }

  addAlbumToFavorites(albumId: string) {
    if (!validate(albumId)) {
      throw InvalidUUIDException();
    }
    const albumIndex = db.albums.findIndex((album) => album.id === albumId);

    if (albumIndex === -1) {
      throw UnprocessableArtistException();
    }
    db.favorites.albums.add(albumId);
    return albumId;
  }

  removeAlbumFromFavorites(albumId: string) {
    if (!validate(albumId)) {
      throw InvalidUUIDException();
    }
    if (!db.favorites.albums.has(albumId)) {
      throw AlbumNotFoundException();
    }
    const albumIndex = db.albums.findIndex((album) => album.id === albumId);
    if (albumIndex !== -1) {
      db.favorites.albums.delete(albumId);
      return;
    }

    throw new InternalServerErrorException(
      'Album is in favorites but not in albums',
    );
  }

  @OnEvent(TRACK_DELETE_EVENT)
  onTrackDelete(trackId: string) {
    db.favorites.tracks.delete(trackId);
  }

  @OnEvent(ALBUM_DELETE_EVENT)
  onAlbumDelete(albumId: string) {
    db.favorites.albums.delete(albumId);
  }

  @OnEvent(ARTIST_DELETE_EVENT)
  onArtistDelete(artistId: string) {
    db.favorites.artists.delete(artistId);
  }
}
