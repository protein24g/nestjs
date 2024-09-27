import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { FreeBoardLikeService } from "./freeBoardLike.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('api/boards/free/likes')
@UseGuards(AuthGuard('jwt'))
export class FreeBoardLikeController {
  constructor(
    private readonly freeBoardLikeService: FreeBoardLikeService,
  ) {}

  @Post(':postId')
  async create(@Param('postId') postId: number, @Req() request: any) {
    await this.freeBoardLikeService.create(postId, request.user.userId);
  }

  @Delete(':postId')
  async delete(@Param('postId') postId: number, @Req() request: any) {
    await this.freeBoardLikeService.delete(postId, request.user.userId);
  }
}