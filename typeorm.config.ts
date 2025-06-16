import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Album } from './src/album/entities/album.entity';
import { Artist } from './src/artist/entities/artist.entity';
import { Favorites } from './src/favorites/entities/favorites.entity';
import { Track } from './src/track/entities/track.entity';
import { User } from './src/user/entities/user.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Artist, Album, Track, Favorites],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
