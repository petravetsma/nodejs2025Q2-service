import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFavoritesDto {
  @ApiProperty({
    example: 'Rolling Scopes',
    description: 'name of the album',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1922, description: 'year of creation of the album' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: 'a69d0380-4c9a-4945-89f5-f9636f675729',
    description: 'id of the artist',
  })
  @IsString()
  @IsOptional()
  artistId: string | null; // refers to Artist
}
