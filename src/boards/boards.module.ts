import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoard } from './freeBoard/board/entities/freeBoard.entity';
import { UserModule } from 'src/user/user.module';
import { FreeCommentController } from './freeBoard/comment/freeComment.controller';
import { FreeCommentService } from './freeBoard/comment/freeComment.service';
import { FreeBoardController } from './freeBoard/board/freeBoard.controller';
import { FreeBoardService } from './freeBoard/board/freeBoard.service';
import { FreeComment } from './freeBoard/comment/entities/freeComment.entity';
import { FreeBoardLikeController } from './freeBoard/board/like/freeBoardLike.controller';
import { FreeBoardLikeService } from './freeBoard/board/like/freeBoardLike.service';
import { FreeBoardLike } from './freeBoard/board/like/entities/freeBoardLike.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      FreeBoard,
      FreeComment,
      FreeBoardLike,
    ])
  ],
  controllers: [
    FreeBoardController,
    FreeCommentController,
    FreeBoardLikeController,
  ],
  providers: [
    FreeBoardService,
    FreeCommentService,
    FreeBoardLikeService,
  ],
})
export class BoardsModule {}
