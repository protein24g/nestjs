import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/auth/roles/entities/user-roles.entity';
import { RolesType } from 'src/auth/roles/enums/roles-type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async signUp(userCreateDto: UserCreateDto) {
    const email = await this.userRepository.findOne({ where: { email: userCreateDto.email }});
    if (email) {
      throw new UnauthorizedException('이미 존재하는 이메일');
    }
    
    const nickname = await this.userRepository.findOne({ where: { nickname: userCreateDto.nickname }});
    if (nickname) {
      throw new UnauthorizedException('이미 존재하는 닉네임');
    }

    const telNumber = await this.userRepository.findOne({ where: { telNumber: userCreateDto.telNumber }});
    if (telNumber) {
      throw new UnauthorizedException('이미 존재하는 휴대폰 번호');
    }
    
    const user = this.userRepository.create({
      ...userCreateDto,
      roles: [],
    });
    await this.userRepository.save(user);

    await this.userRolesRepository.save({
      name: RolesType.USER,
      user
    });

    return { 'message': '회원가입 성공' };
  }

  async findById(userId: number) {
    return await this.userRepository.findOne({ where: {id: userId} });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {email},
      relations: ['roles'],
    });
  }

  async profile(userId: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException("존재하지 않는 유저");
    }
    
    return {
      nickname: user.nickname,
      profileImage: user.profileImage,
    };
  }
}
