import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    example: 'Michael Jackson',
    description: 'name of the artist',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, description: 'dose artist have grammy' })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
