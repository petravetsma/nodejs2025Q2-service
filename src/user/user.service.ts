import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  BadOldPasswordException,
  MissingFieldsException,
  UserNotFoundException,
} from 'src/common/exception';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserResponseDto } from './dto/update-response-dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { uuidValidator } from 'src/common/thrower';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw MissingFieldsException();
    }
    const user = Object.assign(new User(), createUserDto);
    user.id = uuid();
    const now = Date.now();
    user.createdAt = now;
    user.updatedAt = now;

    await this.userRepo.save(user);

    return plainToInstance(UserResponseDto, user);
  }

async findAll(): Promise<UserResponseDto[]> {
    return plainToInstance(UserResponseDto, await this.userRepo.find());
  }

  async findOne(id: string) {
    uuidValidator(id);
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw UserNotFoundException();
    }

    return plainToInstance(UserResponseDto, user);
  }

  async update(id: string, updateUserDto: UpdatePasswordDto) {
    if (
      updateUserDto.oldPassword === undefined ||
      updateUserDto.newPassword === undefined
    ) {
      throw MissingFieldsException();
    }

    uuidValidator(id);
    const user = await this.userRepo.findOneBy({ id }); // throws if not found

    if (!user) {
      throw UserNotFoundException();
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw BadOldPasswordException();
    }
    await this.userRepo.save({
      ...user,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
    });

    return plainToInstance(
      UserResponseDto,
      await this.userRepo.findOneBy({ id }),
    );
  }

  async remove(id: string) {
    uuidValidator(id);
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw UserNotFoundException();
    }
    await this.userRepo.delete(id);
  }
}
