import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FreeComment } from "../../comment/entities/freeComment.entity";
import { FreeBoardLike } from "../like/entities/freeBoardLike.entity";

@Entity()
export class FreeBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text', nullable: false})
  title: string;

  @Column({type: 'text', nullable: false})
  content: string;

  @CreateDateColumn()
  writeDatetime: Date;

  @Column({type: 'int', default: 0})
  favoriteCount: number;

  @Column({type: 'int', default: 0})
  commentCount: number;

  @Column({type: 'int', default: 0})
  viewCount: number;

  @ManyToOne(() => User, user => user.freeBoards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => FreeComment, freeComment => freeComment.post)
  freeComments: FreeComment[];

  @OneToMany(() => FreeBoardLike, freeBoardLike => freeBoardLike.post)
  freeBoardLikes: FreeBoardLike[];
}