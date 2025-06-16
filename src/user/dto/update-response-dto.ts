import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string; // uuid v4

  @Expose()
  login: string;

  @Exclude()
  password: string;

  @Expose()
  version: number; // integer number, increments on update

  @Expose()
  createdAt: number; // timestamp of creation

  @Expose()
  updatedAt: number; // timestamp of last update
}
