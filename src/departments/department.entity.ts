import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('departments')
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
}
