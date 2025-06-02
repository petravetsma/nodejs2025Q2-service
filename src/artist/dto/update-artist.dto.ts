import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateArtistDto {
  @ApiProperty({
    example: 'Bob Marley',
    description: 'name of the artist',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, description: 'does artist have grammy' })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
