import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRoles } from "../entities/user-roles.entity";
import { UserService } from "src/user/user.service";
import { RolesType } from "../enums/roles-type";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(nickname: string, role: RolesType) {
    const user = await this.userService.findByNickname(nickname);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저');
    }

    const targetUserRoles: RolesType[] = [];
    for (const role of user.roles) {
      targetUserRoles.push(role.name);
    }

    if (!targetUserRoles.includes(role)) {
      await this.userRolesRepository.save({
        name: role,
        user,
      });
    } else {
      throw new UnauthorizedException('이미 존재하는 권한');
    }

    return;
  }
}