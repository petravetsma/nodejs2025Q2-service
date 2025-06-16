import { Expose } from 'class-transformer';

@Expose()
export class ArtistResponseDto {
  @Expose()
  id: string; // uuid v4

  @Expose()
  name: string;

  @Expose()
  grammy: boolean; // integer number
}
