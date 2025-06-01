import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { db } from 'src/common/db';
import {
  BadOldPasswordException,
  InvalidUUIDException,
  MissingFieldsException,
  UserNotFoundException,
} from 'src/common/exception';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { UserResponseDto } from 'src/user/dto/update-response-dto';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuid, validate } from 'uuid';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw MissingFieldsException();
    }
    const user = new User();
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.id = uuid();
    user.version = 1;
    const now = Date.now();
    user.createdAt = now;
    user.updatedAt = now;

    db.users.push(user);

    return plainToInstance(UserResponseDto, user);
  }

  findAll(): User[] {
    return plainToInstance(UserResponseDto, db.users);
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const user = db.users.filter((user: User) => user.id === id)[0];

    if (!user) {
      throw UserNotFoundException();
    }

    return plainToInstance(UserResponseDto, user);
  }

  update(id: string, updateUserDto: UpdatePasswordDto) {
    if (
      updateUserDto.oldPassword === undefined ||
      updateUserDto.newPassword === undefined
    ) {
      throw MissingFieldsException();
    }

    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const userId = db.users.findIndex((user) => user.id === id);

    if (userId === -1) {
      throw UserNotFoundException();
    }

    const user: User = db.users[userId];

    if (user.password !== updateUserDto.oldPassword) {
      throw BadOldPasswordException();
    }
    db.users[userId].password = updateUserDto.newPassword;
    db.users[userId].version++;
    db.users[userId].updatedAt = Date.now();

    return plainToInstance(UserResponseDto, db.users[userId]);
  }

  remove(id: string) {
    if (!validate(id)) {
      throw InvalidUUIDException();
    }
    const userId = db.users.findIndex((user) => user.id === id);
    if (userId === -1) {
      throw UserNotFoundException();
    }
    db.users = db.users.filter((user) => user.id !== id);
  }
}
