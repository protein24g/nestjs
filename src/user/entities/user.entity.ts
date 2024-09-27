import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from 'argon2';
import { FreeBoard } from "src/boards/freeBoard/board/entities/freeBoard.entity";
import { FreeComment } from "src/boards/freeBoard/comment/entities/freeComment.entity";
import { FreeBoardLike } from "src/boards/freeBoard/board/like/entities/freeBoardLike.entity";
import { UserRoles } from "src/auth/roles/entities/user-roles.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 50,  nullable: false})
    email: string;

    @Column({type: "varchar", length: 100, nullable: false})
    password: string;

    @Column({type: "varchar", length: 20, nullable: false, unique: true})
    nickname: string;

    @Column({type: "varchar", length: 15, nullable: false, unique: true})
    telNumber: string;

    @Column({type: "text", nullable: false})
    address: string;
    
    @Column({type: "text"})
    addressDetail: string;

    @Column({type: "text"})
    profileImage: string;

    @Column({type: "text", nullable: true})
    hashRefreshToken: string;
    
    @BeforeInsert()
    async hashPassword() {
    this.password = await argon2.hash(this.password);
    }

    @OneToMany(() => FreeBoard, freeBoard => freeBoard.user)
    freeBoards: FreeBoard[];

    @OneToMany(() => FreeComment, freeComment => freeComment.user)
    freeComments: FreeComment[];

    @OneToMany(() => FreeBoardLike, freeBoardLike => freeBoardLike.user)
    freeBoardLikes: FreeBoardLike[];

    @OneToMany(() => UserRoles, userRoles => userRoles.user, { eager: true })
    roles: UserRoles[];
}