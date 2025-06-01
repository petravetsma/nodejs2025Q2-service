import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @ApiProperty({ example: 'bbeeebeep_track', description: 'name of the track' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '3ed5993f-3d6e-471b-a588-94469d674ccf',
    description: 'uuid4 artist id',
  })
  @IsString()
  @IsOptional()
  artistId: string;

  @ApiProperty({
    example: '76af8675-be1c-44a9-a1bc-54373da462af',
    description: 'uuid4 album id',
  })
  @IsString()
  @IsOptional()
  albumId: string;

  @ApiProperty({ example: 120, description: 'duration of the track' })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
