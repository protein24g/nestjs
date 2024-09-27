import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesType } from "../enums/roles-type";

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'enum', enum: RolesType})
  name: RolesType;

  @ManyToOne(() => User, user => user.roles)
  @JoinColumn({name: 'userId'})
  user: User;
}