import { Column, Entity } from 'typeorm';

@Entity()
export class Album {
  @Column('uuid')
  id: string; // uuid v4

  @Column('string')
  name: string;

  @Column('number')
  year: number;

  @Column('string', { nullable: true })
  artistId: string | null; // refers to Artist
}
