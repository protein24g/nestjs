import { User } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FreeBoard } from "../../entities/freeBoard.entity";

@Entity()
export class FreeBoardLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.freeBoardLikes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => FreeBoard, freeBoard => freeBoard.freeBoardLikes)
  @JoinColumn({ name: 'freeBoardId' })
  post: FreeBoard;
}