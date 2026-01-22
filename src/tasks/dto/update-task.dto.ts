// import { IsBoolean, IsOptional, IsString } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsOptional } from "class-validator";

// export class UpdateTaskDto{
//   @IsString()
//   @IsOptional()
//   readonly name?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsBoolean()
//   @IsOptional()
//   readonly completed?: boolean;
// }

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
   @IsBoolean()
   @IsOptional()
   readonly completed?: boolean;
}