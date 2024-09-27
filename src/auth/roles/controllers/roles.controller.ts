import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { RolesService } from "../services/roles.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesType } from "../enums/roles-type";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/role.decorator";

@Controller('api/auth/roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Post()
  @Roles(RolesType.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() body: { nickname: string, role: RolesType }) {
    return await this.rolesService.create(body.nickname, body.role);
  }
}