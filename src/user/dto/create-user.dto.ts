import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'alex', description: 'user login' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'pass12345', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
