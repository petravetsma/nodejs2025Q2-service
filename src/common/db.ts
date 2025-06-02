import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';

interface DB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
}

export const db: DB = {
  users: [],
  tracks: [],
  artists: [],
};
