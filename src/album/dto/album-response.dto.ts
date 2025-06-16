import { Exclude, Expose, Transform } from 'class-transformer';
import { Artist } from 'src/artist/entities/artist.entity';

@Expose()
export class AlbumResponseDto {
  @Expose()
  id: string; // uuid v4

  @Expose()
  name: string;

  @Expose()
  year: number;

  @Transform(
    ({ obj }: { obj: { artist?: Artist | null } }) => obj.artist?.id ?? null,
  )
  @Expose()
  artistId: string | null;

  @Exclude()
  artist: unknown;
}
