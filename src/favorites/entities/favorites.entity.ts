import { Entity, Column } from 'typeorm';

@Entity()
export class Favorites {
  @Column('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  artists: Set<string>;

  @Column('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  albums: Set<string>;

  @Column('uuid', { array: true, default: () => 'ARRAY[]::UUID[]' })
  tracks: Set<string>;
}
