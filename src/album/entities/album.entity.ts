import { Artist } from 'src/artist/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorites.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  artist: Artist | null;

  @ManyToMany(() => Favorites, (favorites) => favorites.albums)
  favorites: Favorites[];
}
