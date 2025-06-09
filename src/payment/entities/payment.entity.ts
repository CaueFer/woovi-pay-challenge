import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMovementType, PaymentType } from '../../lib/defaultConstants';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentMovementType })
  movement: PaymentMovementType;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp with time zone')
  processedAt: Date;
}
