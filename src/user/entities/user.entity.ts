import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('string')
  login: string;

  @Column('string')
  password: string;

  @Column('number')
  version: number;

  @Column('number')
  createdAt: number;

  @Column('number')
  updatedAt: number;
}
