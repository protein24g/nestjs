import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const token = req.cookies['accessToken'];
        if (!token) {
          throw new UnauthorizedException('로그인 후 이용하세요');
        }
        
        return token;
      },
      ignoreElements: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('비정상 엑세스 토큰');
    }

    const roles = await this.authService.convertUserRoles(user.roles);
    return {
      userId: user.id,
      roles,
    };
  }
}