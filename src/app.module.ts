import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      port: +process.env.DATABASE_PORT,
      entities: [__dirname + '/**/*{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
