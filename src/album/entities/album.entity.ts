import { Favorites } from 'src/favorites/entities/favorites.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist

  @ManyToMany(() => Favorites, (favorites) => favorites.artists)
  favorites: Favorites[];
}
