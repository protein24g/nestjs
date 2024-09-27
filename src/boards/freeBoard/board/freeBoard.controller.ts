import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FreeBoardService } from "./freeBoard.service";
import { FreeBoardCreateDTO } from "./dto/freeBoard-create.dto";
import { PaginationDTO } from "src/boards/dto/pagination.dto";
import { FreeBoardUpdateDTO } from "./dto/freeBoard-update.dto";

@Controller('api/boards/free')
export class FreeBoardController {
  constructor(
    private readonly freeBoardService: FreeBoardService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() request: any, @Body() freeBoardCreateDTO: FreeBoardCreateDTO) {
    await this.freeBoardService.create(request.user.userId, freeBoardCreateDTO);
  }

  @Get()
  async findAll(@Query() paginationDTO: PaginationDTO) {
    return await this.freeBoardService.findAll(paginationDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.freeBoardService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: number,
    @Req() request: any,
    @Body() freeBoardUpdateDTO: FreeBoardUpdateDTO) {
    return await this.freeBoardService.update(id, request.user.userId, freeBoardUpdateDTO);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: number, @Req() request: any) {
    return await this.freeBoardService.delete(id, request.user.userId);
  }
}