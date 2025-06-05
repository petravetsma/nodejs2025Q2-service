import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  artists: Set<string>;

  @Column('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  albums: Set<string>;

  @Column('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  tracks: Set<string>;
}
