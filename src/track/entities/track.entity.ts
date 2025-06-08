import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorites.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @ManyToOne(() => Artist, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  artist: Artist | null;

  @ManyToOne(() => Album, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  album: Album | null;

  @Column()
  duration: number; // integer number

  @ManyToMany(() => Favorites, (favorites) => favorites.tracks)
  favorites: Favorites[];
}
