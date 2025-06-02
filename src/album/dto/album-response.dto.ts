import { Expose } from 'class-transformer';

@Expose()
export class AlbumResponseDto {
  @Expose()
  id: string; // uuid v4

  @Expose()
  name: string;

  @Expose()
  year: number;

  @Expose()
  artistId: string | null; // refers to Artist
}
