import { Type } from "class-transformer"
import { IsInt, IsOptional, Max, Min } from "class-validator"

export class PaginationDto {
  @IsInt()
  @Type(() => Number) //Transforma string em number
  @IsOptional()
  @Max(100)
  @Min(0)
  limit?: number

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Max(100)
  @Min(0)
  offset?: number
}