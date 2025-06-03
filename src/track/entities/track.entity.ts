import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column('string')
  name: string;

  @Column('string', { nullable: true })
  artistId: string | null; // refers to Artist

  @Column('string', { nullable: true })
  albumId: string | null; // refers to Album

  @Column('number')
  duration: number; // integer number
}
