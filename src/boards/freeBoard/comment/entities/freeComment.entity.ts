import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FreeBoard } from "../../board/entities/freeBoard.entity";

@Entity()
export class FreeComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text', nullable: false})
  content: string;

  @CreateDateColumn()
  writeDatetime: Date;

  @ManyToOne(() => User, user => user.freeComments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => FreeBoard, freeBoard => freeBoard.freeComments)
  @JoinColumn({ name: 'freeBoardId' })
  post: FreeBoard;
}