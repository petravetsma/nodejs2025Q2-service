import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'user old password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // previous password

  @ApiProperty({ example: 'newpasword345', description: 'user new password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string; // new password
}
