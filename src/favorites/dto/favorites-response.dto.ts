import { Expose } from 'class-transformer';
import { AlbumResponseDto } from 'src/album/dto/album-response.dto';
import { ArtistResponseDto } from 'src/artist/dto/artist-response.dto';
import { TrackResponseDto } from 'src/track/dto/track-response.dto';

@Expose()
export class FavoritesResponseDto {
  @Expose()
  artists: ArtistResponseDto[];

  @Expose()
  albums: AlbumResponseDto[];

  @Expose()
  tracks: TrackResponseDto[];
}
