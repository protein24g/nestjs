import { IsNotEmpty } from "class-validator";

export class FreeBoardUpdateDTO {
  @IsNotEmpty({ message: '제목은 필수 입력입니다.' })
  title: string;

  @IsNotEmpty({ message: '내용은 필수 입력입니다.' })
  content: string;
}