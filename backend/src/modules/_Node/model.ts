import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default abstract class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // history of actions related to this node, either performed on it or by it.
  // What type of column should this be?
  // history: Action[];
}
