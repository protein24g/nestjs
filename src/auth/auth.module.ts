import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenService } from './services/token.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { UserRoles } from './roles/entities/user-roles.entity';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRoles,
    ]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE_IN'),
        },
      }),
    })
  ],
  controllers: [AuthController, RolesController],
  providers: [AuthService, TokenService, RolesService, JwtService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, TokenService, RolesService],
})
export class AuthModule {}
