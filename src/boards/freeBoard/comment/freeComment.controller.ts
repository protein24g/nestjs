import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { FreeCommentService } from "./freeComment.service";
import { FreeCommentCreateDTO } from "./dto/freeComment-create.dto";
import { AuthGuard } from "@nestjs/passport";
import { PaginationDTO } from "src/boards/dto/pagination.dto";
import { FreeCommentUpdateDTO } from "./dto/freeComment-update.dto";

@Controller('api/boards/free/comments')
export class FreeCommentController {
  constructor(
    private readonly freeCommentService: FreeCommentService,
  ) {}
  
  @Post(':postId')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @UseGuards(AuthGuard('jwt'))
  async create(@Param('id') postId: number, @Req() request: any, @Body() freeCommentCreateDTO: FreeCommentCreateDTO) {
    await this.freeCommentService.create(postId, request.user.userId, freeCommentCreateDTO);
  }

  @Get(':postId')
  async findAll(@Param('id') postId: number, @Query() paginationDTO: PaginationDTO) {
    return await this.freeCommentService.findAll(postId, paginationDTO);
  }

  @Patch(':commentId')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('commentId') commentId: number, @Req() request: any, @Body() freeCommentUpdateDTO: FreeCommentUpdateDTO) {
    return await this.freeCommentService.update(commentId, request.user.userId, freeCommentUpdateDTO);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('commentId') commentId: number, @Req() request: any) {
    return await this.freeCommentService.delete(commentId, request.user.userId);
  }
}