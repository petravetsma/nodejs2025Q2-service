import { Favorites } from 'src/favorites/entities/favorites.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist

  @Column({ nullable: true })
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number

  @ManyToMany(() => Favorites, (favorites) => favorites.artists)
  favorites: Favorites[];
}
