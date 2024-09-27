import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDTO {
  @IsNumber()
  @Transform(value => Number(value))
  page: number;

  @IsNumber()
  @Transform(value => Number(value))
  pageSize: number;
}