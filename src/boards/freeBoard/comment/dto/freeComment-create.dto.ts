import { IsNotEmpty } from "class-validator";

export class FreeCommentCreateDTO {
  @IsNotEmpty({ message: '내용은 필수 입력입니다.' })
  content: string;
}