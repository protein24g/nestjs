import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  async signUp(@Body() userCreateDto: UserCreateDto) {
    return await this.userService.signUp(userCreateDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() request: any) {
    return await this.userService.profile(request.user.userId);
  }
}
