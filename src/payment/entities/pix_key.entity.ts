import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
export class PixKey {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  key: string;

  @ManyToOne(() => User)
  @JoinColumn() // o joinColumn vai criar o owner_id pra mim
  @Field(() => User)
  owner: User;
}
