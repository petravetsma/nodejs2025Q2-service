import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const InvalidUUIDException = () =>
  new BadRequestException('UUID is not valid');

export const UserNotFoundException = () =>
  new NotFoundException('User not found');

export const TrackNotFoundException = () =>
  new NotFoundException('Track not found');

export const ArtistNotFoundException = () =>
  new NotFoundException('Artist not found');

export const AlbumNotFoundException = () =>
  new NotFoundException('Album not found');

export const MissingFieldsException = () =>
  new BadRequestException('Missing required fields');

export const BadOldPasswordException = () =>
  new ForbiddenException('Invalid old password');

export const UnprocessableTrackException = () =>
  new UnprocessableEntityException('Unrpcessable track');

export const UnprocessableArtistException = () =>
  new UnprocessableEntityException('Unrpcessable artist');

export const UnprocessableAlbumException = () =>
  new UnprocessableEntityException('Unrpcessable album');
