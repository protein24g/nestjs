import { IsString } from "class-validator";

export class FreeCommentUpdateDTO {
  @IsString()
  content: string;
}