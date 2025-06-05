// favorites.entity.ts
import { Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Entity()
export class Favorites {
  @PrimaryColumn({ default: 'default' })
  id: string;

  @ManyToMany(() => Artist, { eager: true })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Album, { eager: true })
  @JoinTable()
  albums: Album[];

  @ManyToMany(() => Track, { eager: true })
  @JoinTable()
  tracks: Track[];
}
