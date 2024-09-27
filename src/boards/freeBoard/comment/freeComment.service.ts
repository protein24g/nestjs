import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FreeCommentCreateDTO } from "./dto/freeComment-create.dto";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { FreeComment } from "./entities/freeComment.entity";
import { Repository } from "typeorm";
import { FreeBoardService } from "../board/freeBoard.service";
import { PaginationDTO } from "src/boards/dto/pagination.dto";
import { FreeCommentUpdateDTO } from "./dto/freeComment-update.dto";

@Injectable()
export class FreeCommentService {
  constructor(
    @InjectRepository(FreeComment)
    private readonly freeCommentRepository: Repository<FreeComment>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => FreeBoardService))
    private readonly freeBoardService: FreeBoardService,
  ) {}
  
  async create(postId: number, userId: number, freeCommentCreateDTO: FreeCommentCreateDTO) {
    const post = await this.freeBoardService.findOne(postId);
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    const comment = this.freeCommentRepository.create({
      content: freeCommentCreateDTO.content,
      user,
      post, 
    });
    
    await this.freeCommentRepository.save(comment);
  }

  async findAll(postId: number, paginationDTO: PaginationDTO) {
    const { page, pageSize } = paginationDTO;

    const [comments, totalCount] = await this.freeCommentRepository.findAndCount({
      take: pageSize,
      skip: ( page - 1 ) * pageSize,
      relations: ['user'],
      select: {
        user: {
          nickname: true,
          profileImage: true,
        }
      },
      where: {
        post: {
          id: postId,
        }
      }
    });

    return {
      result: comments,
      count: totalCount,
    };
  }

  async update(commentId: number, userId: number, freeCommentUpdateDTO: FreeCommentUpdateDTO) {
    const comment = await this.freeCommentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
      select: {
        user: {
          id: true,
        }
      }
    });
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글');
    }

    if (userId !== comment.user.id) {
      throw new UnauthorizedException('댓글 작성자만 수정 가능합니다');
    }

    comment.content = freeCommentUpdateDTO.content;
    return await this.freeCommentRepository.save(comment);
  }

  async delete(commentId: number, userId: number) {
    const comment = await this.freeCommentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
      select: {
        user: {
          id: true,
        }
      }
    });
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글');
    }

    if (userId !== comment.user.id) {
      throw new UnauthorizedException('댓글 작성자만 삭제 가능합니다');
    }

    return await this.freeCommentRepository.remove(comment);
  }
}