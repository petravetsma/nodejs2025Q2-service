import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

interface DB {
  users: User[];
  tracks: Track[];
}

export const db: DB = {
  users: [],
  tracks: [],
};
