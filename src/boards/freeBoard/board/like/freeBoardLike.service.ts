import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FreeBoardLike } from "./entities/freeBoardLike.entity";
import { Repository } from "typeorm";
import { FreeBoardService } from "../freeBoard.service";
import { UserService } from "src/user/user.service";
import { FreeBoard } from "../entities/freeBoard.entity";

@Injectable()
export class FreeBoardLikeService {
  constructor(
    @InjectRepository(FreeBoardLike)
    private readonly freeBoardLikeRepository: Repository<FreeBoardLike>,
    @InjectRepository(FreeBoard)
    private readonly freeBoardRepository: Repository<FreeBoard>,
    @Inject(forwardRef(() => FreeBoardService))
    private readonly freeBoardService: FreeBoardService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(postId: number, userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저');
    }

    const post = await this.freeBoardRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    const likeCheck = await this.freeBoardLikeRepository.findOne({
      where: {
        user: {
          id: user.id
        },
        post: {
          id: post.id
        }
      }});
    if (likeCheck) {
      throw new BadRequestException('이미 좋아요를 누른 게시글');
    }

    post.favoriteCount += 1;
    await this.freeBoardRepository.save(post);

    const freeBoardLike = this.freeBoardLikeRepository.create({
      user,
      post
    });

    await this.freeBoardLikeRepository.save(freeBoardLike);
  }

  async delete(postId: number, userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저');
    }

    const post = await this.freeBoardRepository.findOne({ where: { id: postId }});
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글');
    }

    const like = await this.freeBoardLikeRepository.findOne({
      where: {
        user: {
          id: user.id
        },
        post: {
          id: post.id
        }
      }});
    if (!like) {
      throw new BadRequestException('이미 좋아요를 취소한 게시글');
    }

    post.favoriteCount -= 1;
    await this.freeBoardRepository.save(post);

    await this.freeBoardLikeRepository.remove(like);
  }
}