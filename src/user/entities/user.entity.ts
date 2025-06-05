import { Favorites } from 'src/favorites/entities/favorites.entity';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @VersionColumn({ default: 1 })
  version: number;

  @Column('bigint', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  createdAt: number;

  @Column('bigint', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  updatedAt: number;

  @ManyToMany(() => Favorites, (favorites) => favorites.artists)
  favorites: Favorites[];
}
