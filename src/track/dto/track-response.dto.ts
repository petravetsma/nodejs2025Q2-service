import { Exclude, Expose, Transform } from 'class-transformer';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';

@Expose()
export class TrackResponseDto {
  @Expose()
  id: string; // uuid v4

  @Expose()
  name: string;

  @Transform(
    ({ obj }: { obj: { artist?: Artist | null } }) => obj.artist?.id ?? null,
  )
  @Expose()
  artistId: string | null;

  @Transform(
    ({ obj }: { obj: { album?: Album | null } }) => obj.album?.id ?? null,
  )
  @Expose()
  albumId: string | null;

  @Expose()
  duration: number; // integer number

  @Exclude()
  artist: unknown;

  @Exclude()
  album: unknown;
}
