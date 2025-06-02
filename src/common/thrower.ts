import { InvalidUUIDException } from 'src/common/exception';
import { validate } from 'uuid';

export function uuidValidator(id: string) {
  if (!validate(id)) {
    throw InvalidUUIDException();
  }
}
