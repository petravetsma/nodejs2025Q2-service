import { Entity, Column } from 'typeorm';

@Entity()
export class Artist {
  @Column('uuid')
  id: string;

  @Column('string')
  name: string;

  @Column('boolean')
  grammy: boolean;
}
