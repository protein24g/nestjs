import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력입니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  password: string;

  @IsNotEmpty({ message: '닉네임은 필수 입력입니다.' })
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  nickname: string;

  @IsNotEmpty({ message: '전화번호는 필수 입력입니다.' })
  @IsString({ message: '전화번호는 문자열이어야 합니다.' })
  telNumber: string;

  @IsNotEmpty({ message: '주소는 필수 입력입니다.' })
  @IsString({ message: '주소는 문자열이어야 합니다.' })
  address: string;

  @IsNotEmpty({ message: '상세 주소는 필수 입력입니다.' })
  @IsString({ message: '상세 주소는 문자열이어야 합니다.' })
  addressDetail: string;

  @IsString({ message: '프로필 이미지는 문자열이어야 합니다.' })
  profileImage: string;
}
