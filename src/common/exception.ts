import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

export const InvalidUUIDException = () =>
  new BadRequestException('UUID is not valid');

export const UserNotFoundException = () =>
  new NotFoundException('User not found');

export const TrackNotFoundException = () =>
  new NotFoundException('Track not found');

export const MissingFieldsException = () =>
  new BadRequestException('Missing required fields');

export const BadOldPasswordException = () =>
  new ForbiddenException('Invalid old password');
