import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';
import { Album } from 'src/album/entities/album.entity';
import { Favorites } from 'src/favorites/entities/favorites.entity';

interface DB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  favorites: Favorites;
}

export const db: DB = {
  users: [],
  tracks: [],
  artists: [],
  albums: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
