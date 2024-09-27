import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { User } from 'src/user/entities/user.entity';
import { UserRoles } from '../roles/entities/user-roles.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    const roles = await this.convertUserRoles(user.roles);
    return {
      userId: user.id,
      roles,
    };
  }

  async login(payload: any) {
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(payload.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async logout(request: any) {
    const user = await this.tokenService.checkRefreshToken(request.user.userId, request.cookies['refreshToken']);

    await this.userRepository.update(user.id, { hashRefreshToken: null });
  }

  async refreshToken(request: any) {
    const user = await this.tokenService.checkRefreshToken(request.user.userId, request.cookies['refreshToken']);

    const accessToken = this.tokenService.createAccessToken({ userId: user.id });
    const refreshToken = this.tokenService.createRefreshToken({ userId: user.id });

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(user.id, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async convertUserRoles(userRoles: UserRoles[]) {
    if (userRoles) {
      const roles: string[] = []; 
      userRoles.forEach(userRole => {
        roles.push(userRole.name);
      });

      return roles;
    }
  } 
}